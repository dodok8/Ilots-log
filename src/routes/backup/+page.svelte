<script lang="ts">
	import { scores } from '$lib/states/score.svelte';
	import { driveService } from './drive.svelte';

	let ready = $state([false, false]);

	$effect(() => {
		if (ready[0] && ready[1]) {
			console.log("hi")
			driveService.initialize();
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
			await driveService?.requestAuth();
			await driveService?.initializeBackup(); // 명시적으로 폴더 초기화
			const jsonString = JSON.stringify(scores.scores, null, 2);
			await driveService?.uploadBackup(jsonString);
			alert('Successfully uploaded to Google Drive!');
		} catch (error) {
			console.error('Failed to upload:', error);
			alert('Failed to upload to Google Drive: ' + (error as Error).message);
		}
	}

	async function downloadFromCloud() {
		try {
			await driveService?.requestAuth();
			const jsonString = await driveService?.downloadBackup();
			const jsonData = JSON.parse(jsonString || '');
			scores.load(jsonData);
			alert('Successfully loaded from Google Drive!');
		} catch (error) {
			console.error('Failed to download:', error);
			alert('Failed to download from Google Drive');
		}
	}

	async function eraseFromCloud() {
		if (
			!confirm('Are you sure you want to delete your cloud backup? This action cannot be undone.')
		) {
			return;
		}

		try {
			await driveService?.requestAuth();
			await driveService?.eraseBackup();
			alert('Successfully deleted backup from Google Drive!');
		} catch (error) {
			console.error('Failed to delete:', error);
			alert('Failed to delete from Google Drive: ' + (error as Error).message);
		}
	}
</script>

<svelte:head>
	<script
		src="https://apis.google.com/js/api.js"
		onload={() => {
			ready[0] = true;
		}}
	></script>
	<script
		src="https://accounts.google.com/gsi/client"
		onload={() => {
			ready[1] = true;
		}}
	></script>
</svelte:head>

<div class="backup-container">
	<div class="card">
		<div class="card-header">
			<h2>Cloud Backup</h2>
			<p class="tos-notice">
				By using this feature, you agree that this application will create and access a file in your
				Google Drive. The file will be used exclusively for backing up your score data.
			</p>
			{#if !driveService.isInitialized}
				<p class="loading">Initializing Google Drive integration...</p>
			{:else}
				<div class="cloud-buttons">
					<button class="cloud-btn" onclick={uploadToCloud}>
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
					<button class="cloud-btn" onclick={downloadFromCloud}>
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
					<button class="cloud-btn delete" onclick={eraseFromCloud}>
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
								d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
							/>
						</svg>
						Erase from Cloud
					</button>
				</div>
			{/if}
		</div>

		<div class="card-divider"></div>

		<div class="card-content">
			<h2>Local Backup</h2>
			<div class="local-buttons">
				<button class="local-btn" onclick={downloadScoresAsJson}>
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
					<input type="file" accept=".json" onchange={handleFileSelect} />
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

	.tos-notice {
		color: #64748b;
		font-size: 0.875rem;
		margin: 0.5rem 0 1rem;
		line-height: 1.4;
		background: #f1f5f9;
		padding: 0.75rem;
		border-radius: 0.5rem;
		border-left: 4px solid #2563eb;
	}

	.cloud-btn.delete {
		background-color: #dc2626;
	}

	.cloud-btn.delete:hover {
		background-color: #b91c1c;
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
