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
			chart.rating = calculateSongRating(chart.difficultyDecimal, chart.score);
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
				src={`https://wiki.rotaeno.cn/${score.imageUrl}`}
			/>
		</div>
		<div class="score-title">
			<h3>
				{#each Object.entries(score.title_localized) as info, idx}
					{info[1]}
					{#if idx == Object.entries(score.title_localized).length - 1}{:else}{' / '}
					{/if}
				{/each}
			</h3>
			<span class="score-id">ID: {score.id}</span>
		</div>
	</div>

	<div class="charts-container">
		{#each score.charts as chart, idx (chart.difficultyLevel)}
			<div class="chart-row">
				<div class="difficulty-badge">
					<span class={`level ${chart.difficultyLevel} `}>{chart.difficultyLevel}</span>
					<span class={`decimal ${chart.difficultyLevel} `}>{chart.difficultyDecimal}</span>
				</div>
				<div class="score-container">
					<span class="calculated-score">
						{chart.rating ?? 0}
					</span>
					<input
						class="score-input"
						id={`${score.id}_${chart.difficultyLevel}`}
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
	.img-container {
		height: 16rem;
		overflow: hidden;
		display: flex;
		align-content: center;
		justify-content: center;
		align-items: center;
		width: fit-content;
	}

	.img-container > img {
		height: 110%;
		border-radius: 50%;
		border: 5px solid white;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.decimal {
		color: white;
	}

	.level.I {
		color: #1cda1b;
	}
	.decimal.I {
		background-color: #1cda1b;
	}

	.level.II {
		color: #3b90ff;
	}
	.decimal.II {
		background-color: #3b90ff;
	}

	.level.III {
		color: #ef960d;
	}
	.decimal.III {
		background-color: #ef960d;
	}

	.level.IV {
		color: #dc43e5;
	}
	.decimal.IV {
		background-color: #dc43e5;
	}

	.level.IV-α {
		color: #bd6eff;
	}
	.decimal.IV-α {
		background-color: #bd6eff;
	}
</style>
