<script lang="ts">
	import type { ChartInfo } from '$lib/types/chart';

	export let chart: ChartInfo;
	export let rank: number;
</script>

<div class="chart-card" data-difficulty={chart.difficulty}>
	<div class="rank">#{rank}</div>
	<div class="image-container">
		<img
			src={chart.imageUrl}
			alt={chart.title}
			loading="lazy"
			crossorigin="anonymous"
		/>
	</div>
	<div class="chart-info">
		<h3 class="song-title">{chart.title}</h3>
		<div class="difficulty">
			<span class={`level ${chart.difficulty}`}>{chart.difficulty}</span>
			<span class={`decimal ${chart.const}`}>{chart.const}</span>
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
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		border-left: 4px solid;
	}

	.chart-card[data-difficulty='Ⅰ'] {
		border-color: #1cda1b;
	}
	.chart-card[data-difficulty='Ⅱ'] {
		border-color: #3b90ff;
	}
	.chart-card[data-difficulty='Ⅲ'] {
		border-color: #ef960d;
	}
	.chart-card[data-difficulty='Ⅳ'] {
		border-color: #dc43e5;
	}
	.chart-card[data-difficulty='Ⅳ-α'] {
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

	.level.Ⅰ {
		color: #1cda1b;
	}
	.level.Ⅱ {
		color: #3b90ff;
	}
	.level.Ⅲ {
		color: #ef960d;
	}
	.level.Ⅳ {
		color: #dc43e5;
	}
	.level.Ⅳ-α {
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
