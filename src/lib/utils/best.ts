import type { ChartInfo } from '$lib/types/chart';
import type { Score } from '$lib/types/score';

export function getBest40(scores: Score[]): ChartInfo[] {
	const sorted_charts = scores
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
		.sort((a, b) => b.rating - a.rating);

	const best40: ChartInfo[] = [];
	for (const chart of sorted_charts) {
		if (best40.length >= 40) break;
		// IV와 IV-α 중 레이팅이 높은 차트만 추가
		// 이미 레이팅으로 정렬된 상태이므로, 먼저 추가된 IV 또는 IV-α 차트가 있는지만 확인하면 됨
		if (
			(chart.difficultyLevel === 'IV' &&
				best40.some((c) => c.difficultyLevel === 'IV-α' && c.songId === chart.songId)) ||
			(chart.difficultyLevel === 'IV-α' &&
				best40.some((c) => c.difficultyLevel === 'IV' && c.songId === chart.songId))
		) {
			continue;
		}
		best40.push(chart);
	}

	return best40;
}

export function getBest40Average(charts: ChartInfo[]): number {
	if (charts.length === 0) return 0;

	const best10 = charts.slice(0, 10);
	const better10 = charts.slice(10, 20);
	const last20 = charts.slice(20, 40);

	const best10rating = best10.reduce((acc, chart) => acc + chart.rating, 0);
	const better10rating = better10.reduce((acc, chart) => acc + chart.rating, 0);
	const last20rating = last20.reduce((acc, chart) => acc + chart.rating, 0);

	const totalRating =
		(best10rating * 0.6) / 10 + (better10rating * 0.2) / 10 + (last20rating * 0.2) / 20;
	return Math.floor(totalRating * 1000.0) / 1000.0;
}

export function getPotentialCharts(scores: Score[], targetRating: number): ChartInfo[] {
	return scores
		.flatMap((song): ChartInfo[] =>
			song.charts
				.filter(
					(chart) =>
						// 현재 점수가 0이 아니고
						chart.score !== 0 &&
						// 난이도가 목표 레이팅 - 3.7 이상인 차트만 선택
						chart.difficultyDecimal >= targetRating - 3.7
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
