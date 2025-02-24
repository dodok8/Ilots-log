<script lang="ts">
	import { scores } from '$lib/states/score.svelte';
	import { DriveService } from '$lib/services/drive';
	import { onMount } from 'svelte';

	let driveService: DriveService;
	let isGoogleApiLoading = true;
	let isCloudBackupEnabled = false;

	onMount(async () => {
		try {
			driveService = DriveService.getInstance();
			await driveService.initialize();
			isGoogleApiLoading = false;
			isCloudBackupEnabled = true;
		} catch (error) {
			console.error('Failed to initialize Drive service:', error);
			isGoogleApiLoading = false;
		}
	});

	// Local backup functions
	function downloadScoresAsJson() {
		const jsonString = JSON.stringify(scores.scores, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.download = `rotaeno_scores_${new Date().toISOString().split('T')[0]}.json`;
		link.href = url;
		link.click();

		URL.revokeObjectURL(url);
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const jsonData = JSON.parse(e.target?.result as string);
				scores.load(jsonData);
				alert('Scores loaded successfully!');
			} catch (error) {
				console.error('Error parsing JSON:', error);
				alert('Failed to load scores. Invalid file format.');
			}
		};
		reader.readAsText(file);
	}

	// Cloud backup functions
	async function uploadToCloud() {
		try {
			await driveService.requestAuth();
			const jsonString = JSON.stringify(scores.scores, null, 2);
			await driveService.uploadBackup(jsonString);
			alert('Successfully uploaded to Google Drive!');
		} catch (error) {
			console.error('Failed to upload:', error);
			alert('Failed to upload to Google Drive');
		}
	}

	async function downloadFromCloud() {
		try {
			await driveService.requestAuth();
			const jsonString = await driveService.downloadBackup();
			const jsonData = JSON.parse(jsonString);
			scores.load(jsonData);
			alert('Successfully loaded from Google Drive!');
		} catch (error) {
			console.error('Failed to download:', error);
			alert('Failed to download from Google Drive');
		}
	}
</script>

<div class="backup-container">
	<div class="card">
		<div class="card-header">
			<h2>Cloud Backup</h2>
			{#if isGoogleApiLoading}
				<p class="loading">Initializing Google Drive integration...</p>
			{:else if !isCloudBackupEnabled}
				<p class="error">Failed to initialize Google Drive integration</p>
			{:else}
				<div class="cloud-buttons">
					<button class="cloud-btn" on:click={uploadToCloud}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="icon"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
							/>
						</svg>
						Upload to Cloud
					</button>
					<button class="cloud-btn" on:click={downloadFromCloud}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="icon"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
							/>
						</svg>
						Download from Cloud
					</button>
				</div>
			{/if}
		</div>

		<div class="card-divider"></div>

		<div class="card-content">
			<h2>Local Backup</h2>
			<div class="local-buttons">
				<button class="local-btn" on:click={downloadScoresAsJson}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="icon"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
						/>
					</svg>
					Download Backup File
				</button>
				<label class="local-btn">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="icon"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
						/>
					</svg>
					Load Backup File
					<input type="file" accept=".json" on:change={handleFileSelect} />
				</label>
			</div>
		</div>
	</div>
</div>

<style>
	.backup-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.card {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		overflow: hidden;
	}

	.card-header {
		padding: 2rem;
		background: #f8fafc;
	}

	.card-divider {
		height: 1px;
		background: #e2e8f0;
	}

	.card-content {
		padding: 2rem;
	}

	h2 {
		margin: 0 0 1rem;
		font-size: 1.5rem;
		color: #1a1a1a;
	}

	.coming-soon {
		color: #64748b;
		font-size: 0.875rem;
		margin: 0.5rem 0;
	}

	.cloud-buttons,
	.local-buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.cloud-btn,
	.local-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
	}

	.cloud-btn {
		background: #2563eb;
		color: white;
	}

	.cloud-btn:hover {
		background: #1d4ed8;
	}

	.cloud-btn:disabled {
		cursor: not-allowed;
		opacity: 0.7;
	}

	.local-btn {
		background: #2563eb;
		color: white;
	}

	.local-btn:hover {
		background: #1d4ed8;
	}

	.icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	input[type='file'] {
		display: none;
	}

	.loading {
		color: #64748b;
		font-size: 0.875rem;
		margin: 0.5rem 0;
	}

	.error {
		color: #dc2626;
		font-size: 0.875rem;
		margin: 0.5rem 0;
	}

	@media (max-width: 640px) {
		.cloud-buttons,
		.local-buttons {
			flex-direction: column;
		}

		.card-header,
		.card-content {
			padding: 1.5rem;
		}
	}
</style>
