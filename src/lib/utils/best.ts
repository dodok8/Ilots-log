import type { ChartInfo } from '$lib/types/chart';
import type { Score } from '$lib/types/score';

export function getBest40(scores: Score[]): ChartInfo[] {
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
		.slice(0, 40);
}

export function getBest40Average(charts: ChartInfo[]): number {
	if (charts.length === 0) return 0;

	const best10 = charts.slice(0, 10);
	const better20 = charts.slice(10, 30);

	// 충분한 곡이 없는 경우 처리
	if (best10.length < 10) {
		return best10.reduce((acc, chart) => acc + chart.rating, 0) / best10.length;
	}

	const best10Rating = best10.reduce((acc, chart) => acc + chart.rating, 0) / 10;
	const better20Rating =
		better20.length > 0
			? better20.reduce((acc, chart) => acc + chart.rating, 0) / Math.min(better20.length, 20)
			: 0;

	return best10Rating * 0.7 + better20Rating * 0.3;
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
