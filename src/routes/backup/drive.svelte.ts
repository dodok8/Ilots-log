import { browser } from '$app/environment';

const BACKUP_FILE_NAME = 'rotaeno_scores_backup.json' as const;
const BACKUP_FOLDER_NAME = 'IlotsLog' as const;

class DriveService {
	isInitialized = $state(false);
	private tokenClient: google.accounts.oauth2.TokenClient | null = $state(null);
	private backupFileId: string | null = $state(null);
	private backupFolderId: string | null = $state(null);

	constructor() {}

	async initialize() {
		if (!browser || this.isInitialized === true) return;

		try {
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
		const folderQuery = `name='${BACKUP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'`;
		const folderResponse = await gapi.client.drive.files.list({
			q: folderQuery,
			spaces: 'drive'
		});

		if (folderResponse.result.files.length === 0) {
			const folderMetadata = {
				name: BACKUP_FOLDER_NAME,
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
			const fileQuery = `name='${BACKUP_FILE_NAME}' and '${this.backupFolderId}' in parents`;
			const fileResponse = await gapi.client.drive.files.list({
				q: fileQuery,
				spaces: 'drive'
			});

			if (fileResponse.result.files.length > 0) {
				this.backupFileId = fileResponse.result.files[0].id;
			}
		}
	}

	async uploadBackup(content: string): Promise<void> {
		try {

			// Create form data for multipart upload
			const metadata = new Blob(
				[
					JSON.stringify({
						name: BACKUP_FILE_NAME,
						mimeType: 'application/json',
						parents: this.backupFileId ? undefined : [this.backupFolderId!]
					})
				],
				{ type: 'application/json' }
			);

			const contentBlob = new Blob([content], { type: 'application/json' });

			const form = new FormData();
			form.append('metadata', metadata);
			form.append('file', contentBlob);

			// Use fetch API for multipart upload
			//@ts-expect-error : idk
			const accessToken = gapi.auth.getToken().access_token;
			const url = this.backupFileId
				? `https://www.googleapis.com/upload/drive/v3/files/${this.backupFileId}?uploadType=multipart`
				: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

			const response = await fetch(url, {
				method: this.backupFileId ? 'PATCH' : 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				body: form
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`Drive API error: ${errorData.error.message}`);
			}

			const result = await response.json();
			console.log('File operation successful:', result);

			if (!this.backupFileId) {
				this.backupFileId = result.id;
			}
		} catch (error) {
			console.error('Upload failed:', error);
			throw error;
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

	async eraseBackup(): Promise<void> {
		if (!this.backupFileId) {
			throw new Error('No backup file found');
		}

		try {
			//@ts-expect-error : idk
			await gapi.client.drive.files.delete({
				fileId: this.backupFileId
			});
			this.backupFileId = null;
			console.log('File deleted successfully');
		} catch (error) {
			console.error('Failed to delete file:', error);
			throw error;
		}
	}
}

const driveService = new DriveService();

export { driveService };
