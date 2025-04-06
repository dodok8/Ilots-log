<script lang="ts">
	import { scores } from '$lib/states/score.svelte';
	import BestChartCard from './BestChartCard.svelte';
	import html2canvas from 'html2canvas';

	let containerRef: HTMLDivElement;
	let downloadBtn: HTMLButtonElement;

	async function downloadAsImage() {
		if (!containerRef) return;

		try {
			const canvas = await html2canvas(containerRef, {
				useCORS: true,
				allowTaint: true,
				width: 1200,
				scale: 2, // 고해상도를 위해
				backgroundColor: '#ffffff',
				ignoreElements: (element) => {
					// 다운로드 버튼을 캡처에서 제외
					return element === downloadBtn;
				}
			});

			const link = document.createElement('a');
			link.download = `best40_${new Date().toISOString().split('T')[0]}.png`;
			link.href = canvas.toDataURL('image/png');
			link.click();
		} catch (error) {
			console.error('Failed to generate image:', error);
		}
	}
</script>

<div class="best40-container" bind:this={containerRef}>
	<div class="header">
		<h1>Best 40</h1>
		<div class="header-actions">
			<span class="average">Average Rating: {scores.best40Average.toFixed(3)}</span>
			<button class="download-btn" on:click={downloadAsImage} bind:this={downloadBtn}>
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
						d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
					/>
				</svg>
				Download Image
			</button>
		</div>
	</div>

	<div class="charts-grid">
		{#each scores.best40Songs as chart, index}
			<BestChartCard {chart} rank={index + 1} />
		{/each}
	</div>
</div>

<style>
	.best40-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.average {
		font-size: 1.25rem;
		font-weight: 500;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1.5rem;
	}

	@media (max-width: 1200px) {
		.charts-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 960px) {
		.charts-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 640px) {
		.charts-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.download-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background-color: #2563eb;
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.download-btn:hover {
		background-color: #1d4ed8;
	}

	.icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (max-width: 640px) {
		.header-actions {
			flex-direction: column;
			align-items: flex-end;
			gap: 0.5rem;
		}
	}
</style>
