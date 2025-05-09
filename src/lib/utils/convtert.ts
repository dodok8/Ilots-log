import type { OldScore, Score } from '$lib/types/score';

// Helper function to map difficulty strings to the specific Roman numeral type
const mapDifficulty = (level: string | undefined | null): 'Ⅰ' | 'Ⅱ' | 'Ⅲ' | 'Ⅳ' | 'Ⅳ-α' => {
	const upperLevel = level ? level.toUpperCase().trim() : '';
	switch (upperLevel) {
		case 'I':
			return 'Ⅰ';
		case 'II':
			return 'Ⅱ';
		case 'III':
			return 'Ⅲ';
		case 'IV':
			return 'Ⅳ';
		case 'IV-α':
			return 'Ⅳ-α';
		default:
			// console.warn(`Unknown difficulty level: "${level}", defaulting to Ⅰ`);
			// 프로덕션에서는 더 견고한 오류 처리 또는 기본값 전략이 필요할 수 있습니다.
			return 'Ⅰ'; // 기본값
	}
};

/**
 * Converts a single OldScore object by merging its chart scores/ratings into a
 * base Score structure (which should have metadata ideally from a Song object).
 * The second parameter `baseScoreStructure` provides the definitive metadata.
 */
export const convertScores = (oldScore: OldScore): Score => {
	// baseScoreStructure (Song 타입)의 메타데이터를 사용하고,
	// oldScoreItem의 차트 점수/평점을 채웁니다.
	return {
		id: '',
		imageUrl: '',
		title: oldScore.title_localized.default,
		pack: '',
		composer: '',
		chartDesigner: '',
		artwork: '',
		ver: oldScore.releaseVersion,
		charts: oldScore.charts.map((item) => {
			return {
				difficulty: mapDifficulty(item.difficultyLevel),
				const: item.difficultyDecimal,
				score: item.score || 0,
				rating: item.rating || 0
			};
		})
	};
};
