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

<div class="songs-container">
	{#each filteredScores as score (score.id)}
		<SongCard {score} />
	{/each}
</div>

<style>
	.search-container {
		position: sticky;
		top: 5rem; /* Header 높이에 맞춤 */
		background-color: white;
		padding: 1rem 0;
		z-index: 99;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin: 2rem 0; /* 상하 여백 추가 */
	}

	.header {
		display: flex;
		gap: 1rem;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.search-input {
		flex: 1;
		padding: 0.5rem 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.reset-button {
		padding: 0.5rem 1rem;
		background-color: #ef4444;
		color: white;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.reset-button:hover {
		background-color: #dc2626;
	}

	.songs-container {
		padding-top: 1rem; /* margin 대신 padding 사용 */
	}
</style>
