<script lang="ts">
	import SongCard from './SongCard.svelte';
	import { scores } from '$lib/states/score.svelte';

	let searchTerm = $state('');

	let filteredScores = $derived(
		scores.scores.filter((score) => {
			const term = searchTerm.toLowerCase();

			// ID 검색
			if (score.id.toLowerCase().includes(term)) return true;

			// 모든 언어의 title 검색
			return Object.values(score.title_localized).some((title) =>
				title.toLowerCase().includes(term)
			);
		})
	);

	const handleReset = () => {
		if (confirm('Are you sure you want to reset all scores?')) {
			scores.reset();
		}
	};
</script>

<div class="search-container">
	<div class="header">
		<input type="text" placeholder="Search songs..." bind:value={searchTerm} class="search-input" />
		<button class="reset-button" onclick={handleReset}> Reset All Scores </button>
	</div>
</div>

{#each filteredScores as score (score.id)}
	<SongCard {score} />
{/each}

<style>
</style>
