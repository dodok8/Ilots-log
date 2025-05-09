<script lang="ts">
	import { scores } from '$lib/states/score.svelte';
	import { getPotentialCharts } from '$lib/utils/best';
	import { calculateRequiredScore } from '$lib/utils/rating';

	let potentialCharts = $derived(
		getPotentialCharts(scores.scores, scores.targetRating)
			.map((chart) => ({
				...chart,
				requiredScore: calculateRequiredScore(chart.const, scores.targetRating)
			}))
			.map((chart) => ({
				...chart,
				scoreDiff: chart.requiredScore - chart.score
			}))
			.filter((chart) => chart.requiredScore > 0 && chart.scoreDiff > 0)
			.sort((a, b) => a.scoreDiff - b.scoreDiff)
	);
</script>

<div class="report-container">
	<div class="header">
		<div class="rating-info">
			<span class="rating-label">Avg: {scores.best40Average.toFixed(3)}</span>
			<span class="separator">|</span>
			<span class="rating-label">Target: {scores.targetRating.toFixed(3)}</span>
		</div>
	</div>

	<div class="potential-charts">
		<h3>Potential Increment Recommendation</h3>
		<ul>
			{#each potentialCharts as chart}
				<li>
					<div class="chart-info" data-difficulty={chart.difficulty}>
						<h4>{chart.title}</h4>
						<div class="score-info">
							<span>
								[<span class={`difficulty-level ${chart.difficulty}`}
									>{chart.difficulty}</span
								>]
								{chart.const}
							</span>
							<span class="score-group">
								<span class="score-current">
									<span class="score-label">Current:</span>
									<span class="score-value">{chart.score.toLocaleString()}</span>
									<span class="rating-value">({chart.rating.toFixed(3)})</span>
								</span>
								<span class="arrow">→</span>
								<span class="score-required">
									<span class="score-label">Required:</span>
									<span class="score-value">{chart.requiredScore.toLocaleString()}</span>
									<span class="score-diff">(+{chart.scoreDiff.toLocaleString()})</span>
								</span>
							</span>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.header {
		position: sticky;
		top: 5rem;
		background-color: white;
		padding: 1rem 0;
		z-index: 99;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.rating-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.5rem 2rem;
	}

	.rating-label {
		font-size: 1rem;
		font-weight: 500;
		color: #1a1a1a;
	}

	.separator {
		color: #94a3b8;
	}

	.potential-charts {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.potential-charts h3 {
		margin-bottom: 1rem;
		font-size: 1.25rem;
		color: #1a1a1a;
	}

	.potential-charts ul {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		list-style: none;
		padding: 0;
	}

	.chart-info {
		background: white;
		border-radius: 0.75rem;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.5rem;
		border-left-width: 4px;
		border-left-style: solid;
	}

	.chart-info h4 {
		margin: 0;
		grid-column: 1 / -1;
		font-size: 1rem;
		color: #1a1a1a;
	}

	/* 난이도별 보더 색상 */
	.chart-info[data-difficulty='Ⅰ'] {
		border-left-color: #1cda1b;
	}
	.chart-info[data-difficulty='Ⅱ'] {
		border-left-color: #3b90ff;
	}
	.chart-info[data-difficulty='Ⅲ'] {
		border-left-color: #ef960d;
	}
	.chart-info[data-difficulty='Ⅳ'] {
		border-left-color: #dc43e5;
	}
	.chart-info[data-difficulty='Ⅳ-α'] {
		border-left-color: #bd6eff;
	}

	/* 스코어 정보 스타일링 */
	.score-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		color: #4b5563;
		font-size: 0.875rem;
	}

	.score-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.score-current,
	.score-required {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.score-label {
		color: #6b7280;
	}

	.score-value {
		font-weight: 600;
		color: #1a1a1a;
	}

	.rating-value {
		color: #4b5563;
	}

	.score-diff {
		color: #2563eb;
		font-weight: 500;
	}

	.arrow {
		color: #9ca3af;
	}

	.difficulty-level {
		font-weight: 600;
	}

	.difficulty-level.Ⅰ {
		color: #1cda1b;
	}
	.difficulty-level.Ⅱ {
		color: #3b90ff;
	}
	.difficulty-level.Ⅲ {
		color: #ef960d;
	}
	.difficulty-level.Ⅳ {
		color: #dc43e5;
	}
	.difficulty-level.Ⅳ-α {
		color: #bd6eff;
	}

	@media (max-width: 640px) {
		.rating-info {
			padding: 0.5rem 1rem;
		}

		.potential-charts {
			padding: 0 1rem;
		}

		.chart-info {
			grid-template-columns: 1fr;
		}

		.score-group {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.arrow {
			display: none;
		}
	}
</style>
