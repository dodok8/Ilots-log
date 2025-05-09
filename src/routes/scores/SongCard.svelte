<script lang="ts">
	import type { Score } from '$lib/types/score';
	import { calculateSongRating } from '$lib/utils/rating';
	import { scores } from '$lib/states/score.svelte';

	let { score = $bindable() }: { score: Score } = $props();
	let saveTimeout: number;

	// 점수가 변경될 때마다 해당 차트의 rating만 계산하고 debounce된 저장 실행
	const updateRating = (chart: Score['charts'][0]) => {
		if (chart.score === 0) {
			chart.rating = 0;
		} else if (chart.score !== undefined && chart.score !== null) {
			chart.rating = calculateSongRating(chart.const, chart.score);
		}

		// Debounce save operation
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			scores.save();
		}, 1000) as unknown as number;
	};
</script>

<div class="score-card">
	<div class="score-header">
		<div class="img-container">
			<img
				class="score-image"
				alt={`File: songs ${score.id}.png`}
				loading="lazy"
				src={score.imageUrl}
			/>
		</div>
		<div class="score-info">
			<div class="score-title">
				<h3>
					{score.title}
				</h3>
				<span class="score-id">ver: {score.ver}</span>
			</div>
			<div class="song-credits">
				<span class="artist">
						composer:	{score.composer} / artwork: {score.artwork}
				</span>
			</div>
		</div>
	</div>

	<div class="charts-container">
		{#each score.charts as chart, idx (chart.difficulty)}
			<div class="chart-row">
				<div class="chart-info">
					<div class="difficulty-badge">
						<span class={`level ${chart.difficulty}`}>{chart.difficulty}</span>
						<span class={`decimal ${chart.difficulty}`}>{chart.const}</span>
						<span class={`rating ${chart.difficulty}`}>
							({(chart.rating ?? 0).toFixed(3)})
						</span>
					</div>
				</div>
				<div class="score-container">
					<input
						class="score-input"
						type="number"
						bind:value={chart.score}
						oninput={() => updateRating(chart)}
					/>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.score-card {
		background: white;
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.score-header {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.img-container {
		height: 8rem;
		width: 8rem;
		overflow: hidden;
		border-radius: 50%;
		flex-shrink: 0;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.img-container > img {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	.score-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	.score-title {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.score-title h3 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1a1a1a;
		overflow-wrap: break-word;
	}

	.score-id {
		color: #666;
		font-size: 0.875rem;
	}

	.song-credits {
		display: flex;
		gap: 1rem;
		color: #4b5563;
		font-size: 0.875rem;
	}

	.artist,
	.chart-designer {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.icon {
		width: 1rem;
		height: 1rem;
	}

	.charts-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.chart-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 15px;
		border-radius: 0.5rem;
		background: #f8f9fa;
		width: calc(100% - 15px);
	}

	.chart-info {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.difficulty-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.level {
		font-weight: 600;
		font-size: 1.25rem;
	}

	.decimal {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-weight: 500;
	}

	.rating {
		font-size: 0.875rem;
		font-weight: 500;
		color: inherit;
	}

	.chart-designer {
		color: #4b5563;
		font-size: 0.875rem;
	}

	.score-container {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		max-width: 40%;
	}

	.calculated-score {
		min-width: 4rem;
		text-align: right;
		font-weight: 600;
		color: #1a1a1a;
		font-size: 1.125rem;
	}

	.score-input {
		width: 70%;
		padding: 0.5rem 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		font-size: 1.125rem;
		text-align: right;
	}

	.score-input:focus {
		outline: none;
		border-color: #3b90ff;
		color: #1cda1b;
	}
	.decimal.Ⅰ {
		background-color: #1cda1b;
	}

	.level.Ⅱ {
		color: #3b90ff;
	}
	.decimal.Ⅱ {
		background-color: #3b90ff;
	}

	.level.Ⅲ {
		color: #ef960d;
	}
	.decimal.Ⅲ {
		background-color: #ef960d;
	}

	.level.Ⅳ {
		color: #dc43e5;
	}
	.decimal.Ⅳ {
		background-color: #dc43e5;
	}

	.level.Ⅳ-α {
		color: #bd6eff;
	}
	.decimal.Ⅳ-α {
		background-color: #bd6eff;
	}

	.rating.Ⅰ {
		color: #1cda1b;
	}
	.rating.Ⅱ {
		color: #3b90ff;
	}
	.rating.Ⅲ {
		color: #ef960d;
	}
	.rating.Ⅳ {
		color: #dc43e5;
	}
	.rating.Ⅳ-α {
		color: #bd6eff;
	}

	/* 모바일 대응 */
	@media (max-width: 640px) {
		.score-header {
			flex-direction: column;
			align-items: center;
		}
		.chart-info {
			flex-direction: column;
			align-items: flex-start;
		}

		.score-info {
			width: 100%;
		}
	}
</style>
