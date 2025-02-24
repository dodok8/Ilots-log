import { browser } from '$app/environment';

export class DriveService {
	private static instance: DriveService;
	private isInitialized = false;
	private tokenClient: google.accounts.oauth2.TokenClient | null = null;
	private static readonly BACKUP_FILE_NAME = 'rotaeno_scores_backup.json';
	private static readonly BACKUP_FOLDER_NAME = 'IlotsLog';
	private backupFileId: string | null = null;
	private backupFolderId: string | null = null;

	private constructor() {}

	static getInstance(): DriveService {
		if (!DriveService.instance) {
			DriveService.instance = new DriveService();
		}
		return DriveService.instance;
	}

	async initialize() {
		if (!browser || this.isInitialized) return;

		try {
			// Load Google API
			await this.loadScript('https://apis.google.com/js/api.js');
			// Load Google Identity Services
			await this.loadScript('https://accounts.google.com/gsi/client');

			// Initialize GAPI client
			await new Promise<void>((resolve) => {
				gapi.load('client', resolve);
			});

			await gapi.client.init({
				apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
				discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
			});

			this.tokenClient = google.accounts.oauth2.initTokenClient({
				client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
				scope: 'https://www.googleapis.com/auth/drive.file',
				callback: () => {} // Will be set during auth request
			});

			this.isInitialized = true;
			console.log('Google API initialized successfully');
		} catch (error) {
			console.error('Failed to initialize Google API:', error);
			throw error;
		}
	}

	async requestAuth(): Promise<void> {
		if (!this.tokenClient) {
			throw new Error('Service not initialized');
		}

		return new Promise((resolve, reject) => {
			this.tokenClient!.callback = (response) => {
				if (response.error) {
					reject(response);
				} else {
					resolve();
				}
			};

			this.tokenClient!.requestAccessToken();
		});
	}

	async initializeBackup(): Promise<void> {
		// Find or create backup folder
		const folderQuery = `name='${DriveService.BACKUP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'`;
		const folderResponse = await gapi.client.drive.files.list({
			q: folderQuery,
			spaces: 'drive'
		});

		if (folderResponse.result.files.length === 0) {
			const folderMetadata = {
				name: DriveService.BACKUP_FOLDER_NAME,
				mimeType: 'application/vnd.google-apps.folder'
			};
			const folder = await gapi.client.drive.files.create({
				resource: folderMetadata
			});
			this.backupFolderId = folder.result.id;
		} else {
			this.backupFolderId = folderResponse.result.files[0].id;
		}

		// Find existing backup file
		if (this.backupFolderId) {
			const fileQuery = `name='${DriveService.BACKUP_FILE_NAME}' and '${this.backupFolderId}' in parents`;
			const fileResponse = await gapi.client.drive.files.list({
				q: fileQuery,
				spaces: 'drive'
			});

			if (fileResponse.result.files.length > 0) {
				this.backupFileId = fileResponse.result.files[0].id;
			}
		}
	}

	private loadScript(src: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = src;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
			document.head.appendChild(script);
		});
	}

	async uploadBackup(content: string): Promise<void> {
		if (!this.backupFolderId) {
			await this.initializeBackup();
		}

		const metadata = {
			name: DriveService.BACKUP_FILE_NAME,
			parents: this.backupFileId ? undefined : [this.backupFolderId!]
		};

		if (this.backupFileId) {
			// Update existing file
			await gapi.client.drive.files.update({
				fileId: this.backupFileId,
				resource: metadata,
				media: {
					mimeType: 'application/json',
					body: content
				}
			});
		} else {
			// Create new file
			const response = await gapi.client.drive.files.create({
				resource: metadata,
				media: {
					mimeType: 'application/json',
					body: content
				},
				fields: 'id'
			});
			this.backupFileId = response.result.id;
		}
	}

	async downloadBackup(): Promise<string> {
		if (!this.backupFileId) {
			throw new Error('No backup file found');
		}

		const response = await gapi.client.drive.files.get({
			fileId: this.backupFileId,
			alt: 'media'
		});

		return response.body;
	}
}
