<script lang="ts">
	import { scores } from '$lib/states/score.svelte';
	import { getPotentialCharts } from '$lib/utils/best';
	import { calculateRequiredScore } from '$lib/utils/rating';

	let potentialCharts = $derived(getPotentialCharts(scores.scores, scores.targetRating));
</script>

<div class="home-container">
</div>
