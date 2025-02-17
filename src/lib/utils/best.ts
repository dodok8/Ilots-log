import type { ChartInfo } from '$lib/types/chart';
import type { Score } from '$lib/types/score';

export function getBest30(scores: Score[]): ChartInfo[] {
	return scores
		.flatMap((song): ChartInfo[] =>
			song.charts
				.filter((chart) => (chart.rating ?? 0) > 0)
				.map((chart) => ({
					songId: song.id,
					songTitle: song.title_localized.default,
					imageUrl: song.imageUrl,
					difficultyLevel: chart.difficultyLevel,
					difficultyDecimal: chart.difficultyDecimal,
					score: chart.score ?? 0,
					rating: chart.rating ?? 0
				}))
		)
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 30);
}

export function getBest30Average(charts: ChartInfo[]): number {
	return charts.length > 0
		? charts.reduce((sum, chart) => sum + chart.rating, 0) / charts.length
		: 0;
}

export function getPotentialCharts(scores: Score[], targetRating: number): ChartInfo[] {
	return scores
		.flatMap((song): ChartInfo[] =>
			song.charts
				.filter(
					(chart) =>
						// 현재 점수가 0이 아니고
						chart.score !== 0 &&
						// 난이도가 목표 레이팅 - 3.6 이상인 차트만 선택
						chart.difficultyDecimal >= targetRating - 3.6
				)
				.map((chart) => ({
					songId: song.id,
					songTitle: song.title_localized.default,
					imageUrl: song.imageUrl,
					difficultyLevel: chart.difficultyLevel,
					difficultyDecimal: chart.difficultyDecimal,
					score: chart.score ?? 0,
					rating: chart.rating ?? 0
				}))
		)
		.sort((a, b) => b.rating - a.rating);
}
