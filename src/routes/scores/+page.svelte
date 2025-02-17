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
	</div>
</div>

<div class="reset-container">
	<button class="reset-button" onclick={handleReset} aria-label="Reset All Scores">
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
	</button>
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
		flex-direction: column;
		gap: 1rem;
		align-items: stretch;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.search-input {
		padding: 0.5rem 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.reset-container {
		position: fixed;
		bottom: 2rem;
		left: 2rem; /* right -> left로 변경 */
		z-index: 98;
	}

	.reset-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background-color: #ef4444;
		color: white;
		border: none;
		border-radius: 9999px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		white-space: nowrap; /* 텍스트 줄바꿈 방지 */
	}

	.reset-button:hover {
		background-color: #dc2626;
		transform: translateY(-2px);
		box-shadow: 0 6px 8px -1px rgb(0 0 0 / 0.15);
	}

	.icon {
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0; /* 아이콘 크기 고정 */
	}

	.songs-container {
		padding-top: 1rem; /* margin 대신 padding 사용 */
	}

	/* 데스크톱 화면에서는 가로 배치 */
	@media (min-width: 640px) {
		.header {
			flex-direction: row;
			align-items: center;
		}

		.search-input {
			flex: 1;
			width: auto;
		}

		.reset-button {
			flex-shrink: 0;
		}
	}

	/* 모바일에서는 아이콘만 표시 */
	@media (max-width: 640px) {
		.reset-container {
			bottom: 1.5rem;
		}

		.reset-button {
			width: 3.5rem; /* 고정된 크기 설정 */
			height: 3.5rem;
			padding: 0;
			display: grid;
			place-items: center; /* 아이콘 중앙 정렬 */
			border-radius: 50%;
		}

		.reset-button span {
			display: none; /* 텍스트 숨김 */
		}

		.icon {
			margin: 0; /* 아이콘 마진 제거 */
		}
	}
</style>
