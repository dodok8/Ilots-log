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
	const better10 = charts.slice(10, 20);
	const last20 = charts.slice(20, 40);

	const best10rating = best10.reduce((acc, chart) => acc + chart.rating, 0);
	const better10rating = better10.reduce((acc, chart) => acc + chart.rating, 0);
	const last20rating = last20.reduce((acc, chart) => acc + chart.rating, 0);

	const totalRating =
		(best10rating * 0.6) / 10 + (better10rating * 0.2) / 10 + (last20rating * 0.2) / 20;
	// 최종 레이팅을 소수점 아래 4자리까지 반올림 후 소수점 아래 3자리가 되도록 버림(3자리까지만 출력).
	// Ref: https://wiki.rotaeno.cn/Rating
	return Math.floor(Math.round(totalRating * 10000.0) / 10.0) / 1000.0;
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
