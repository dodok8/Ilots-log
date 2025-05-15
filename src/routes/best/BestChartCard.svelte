<script lang="ts">
	import type { ChartInfo } from '$lib/types/chart';
	import { onMount } from 'svelte';

	let { chart, rank }: { chart: ChartInfo, rank: number } = $props();
	let imageSrc: string = $state('');

	// 빌드 시점에 모든 이미지 파일 매핑 (필요한 것만 사용)
	const imageFiles = import.meta.glob('/src/lib/data/images/*.avif', { eager: true, as: 'url' });

	onMount(() => {
		// chart.songId에 해당하는 이미지 파일 경로 생성
		const imagePath = `/src/lib/data/images/${chart.songId}.avif`;
		
		// 해당 경로의 이미지가 있는지 확인
		if (imagePath in imageFiles) {
			// 로컬 이미지가 있는 경우
			imageSrc = imageFiles[imagePath];
		} else {
			// 로컬에 없는 경우 원격 이미지로 폴백
			imageSrc = `https://images.weserv.nl/?url=wiki.rotaeno.cn/${chart.imageUrl}`;
		}
	});
</script>

<div class="chart-card" data-difficulty={chart.difficultyLevel}>
	<div class="rank">#{rank}</div>
	<div class="image-container">
		<img
			src={imageSrc}
			alt={chart.songTitle}
			loading="lazy"
			crossorigin="anonymous"
		/>
	</div>
	<div class="chart-info">
		<h3 class="song-title">{chart.songTitle}</h3>
		<div class="difficulty">
			<span class={`level ${chart.difficultyLevel}`}>{chart.difficultyLevel}</span>
			<span class={`decimal ${chart.difficultyLevel}`}>{chart.difficultyDecimal}</span>
		</div>
		<div class="score-info">
			<span class="score">{chart.score.toLocaleString()}</span>
			<span class="rating">Rating: {chart.rating.toFixed(3)}</span>
		</div>
	</div>
</div>

<style>
	.chart-card {
		position: relative;
		background: white;

		overflow: hidden;

		border-left: 4px solid;
	}

	.chart-card[data-difficulty='I'] {
		border-color: #1cda1b;
	}
	.chart-card[data-difficulty='II'] {
		border-color: #3b90ff;
	}
	.chart-card[data-difficulty='III'] {
		border-color: #ef960d;
	}
	.chart-card[data-difficulty='IV'] {
		border-color: #dc43e5;
	}
	.chart-card[data-difficulty='IV-α'] {
		border-color: #bd6eff;
	}

	.rank {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: rgba(0, 0, 0, 0.75);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	.image-container {
		aspect-ratio: 1;
		overflow: hidden;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.chart-info {
		padding: 1rem;
	}

	.song-title {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.difficulty {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.5rem 0;
	}

	.level {
		font-weight: 600;
	}

	.level.I {
		color: #1cda1b;
	}
	.level.II {
		color: #3b90ff;
	}
	.level.III {
		color: #ef960d;
	}
	.level.IV {
		color: #dc43e5;
	}
	.level.IV-α {
		color: #bd6eff;
	}

	.decimal {
		color: #6b7280;
	}

	.score-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.875rem;
	}

	.score {
		color: #4b5563;
	}

	.rating {
		font-weight: 600;
		color: #1a1a1a;
	}

	@media (min-width: 480px) {
		.score-info {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
