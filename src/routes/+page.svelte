<script lang="ts">
	import { scores } from '$lib/states/score.svelte';
	import { getPotentialCharts } from '$lib/utils/best';
	import { calculateRequiredScore } from '$lib/utils/rating';

	let potentialCharts = $derived(getPotentialCharts(scores.scores, scores.targetRating));
</script>

<div class="home-container">
	<div>
		<h1>Avg.: {scores.best30Average.toFixed(2)}</h1>
		<h2>Target Rating: {scores.targetRating}</h2>
	</div>
	<div class="potential-charts">
		<h3>Potential Increment Recommendation</h3>
		<ul>
			{#each potentialCharts as chart}
				{@const requiredScore = calculateRequiredScore(
					chart.difficultyDecimal,
					scores.targetRating
				)}
				{@const scoreDiff = requiredScore - chart.score}
				{#if requiredScore > 0 && scoreDiff > 0}
					<li>
						<div class="chart-info">
							<h4>{chart.songTitle}</h4>
							<span>[{chart.difficultyLevel}] {chart.difficultyDecimal}</span>
							<span>Current Score: {chart.score.toLocaleString()}</span>
							<span>Current Rating: {chart.rating.toFixed(2)}</span>
							<span>Required Score: {requiredScore.toLocaleString()}</span>
							<span>Score to improve: {scoreDiff}</span>
						</div>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</div>
