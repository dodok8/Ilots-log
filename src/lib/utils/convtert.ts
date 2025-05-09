import type { OldScore, Score } from '$lib/types/score';
import type { Song } from '$lib/types/song'; // Song 타입 import

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
 * Converts an array of OldScore objects to an array of Score objects.
 * This function performs the initial structural transformation based on OldScore data.
 * The resulting Score[] will then be processed by initializeScores to merge with
 * the latest song metadata from songs.json.
 */
export const convertOldScoreArrayToNewScoreArray = (oldScores: OldScore[]): Score[] => {
    if (!oldScores || !Array.isArray(oldScores)) return [];

    return oldScores.map((oldScore): Score => {
        let title = 'Unknown Title';
        if (oldScore.title_localized && typeof oldScore.title_localized === 'object') {
            title =
                oldScore.title_localized.default ||
                oldScore.title_localized.en || // 영어 제목 우선 시도
                oldScore.title_localized[Object.keys(oldScore.title_localized)[0]] || // 첫 번째 유효한 지역화 제목
                title;
        }

        // OldScore의 첫 번째 차트에서 artwork(jacketDesigner) 가져오기
        const artwork = oldScore.charts?.[0]?.jacketDesigner || 'Unknown Artist';

        // OldScore의 모든 차트에서 고유한 chartDesigner 목록 만들기
        const chartDesigners = new Set<string>();
        oldScore.charts?.forEach((chart) => {
            if (chart.chartDesigner) {
                chartDesigners.add(chart.chartDesigner);
            }
        });
        const chartDesignerString =
            chartDesigners.size > 0 ? Array.from(chartDesigners).join(', ') : 'Unknown Designer';

        return {
            id: oldScore.id, // OldScore의 ID 사용 (나중에 songs.json 기준으로 업데이트될 수 있음)
            imageUrl: oldScore.imageUrl, // OldScore의 imageUrl 사용 (나중에 songs.json 기준으로 업데이트될 수 있음)
            title: title, // 추출된 제목 사용
            pack: oldScore.chapter || 'Unknown Pack', // OldScore의 chapter를 pack으로 매핑
            composer: oldScore.artist || 'Unknown Composer', // OldScore의 artist를 composer로 매핑
            chartDesigner: chartDesignerString, // OldScore 차트 디자이너 목록
            artwork: artwork, // OldScore 자켓 디자이너
            ver: oldScore.releaseVersion || 'Unknown Version', // OldScore의 releaseVersion을 ver로 매핑
            charts:
                oldScore.charts?.map((oldChart) => ({
                    difficulty: mapDifficulty(oldChart.difficultyLevel),
                    const: oldChart.difficultyDecimal,
                    score: oldChart.score ?? 0, // score가 없으면 0으로 기본값 설정
                    rating: oldChart.rating ?? 0 // rating이 없으면 0으로 기본값 설정
                })) || []
        };
    });
};

/**
 * Converts a single OldScore object by merging its chart scores/ratings into a
 * base Score structure (which should have metadata ideally from a Song object).
 * The second parameter `baseScoreStructure` provides the definitive metadata.
 */
export const convertScores = (oldScoreItem: OldScore, baseScoreStructure: Song): Score => {
    // baseScoreStructure (Song 타입)의 메타데이터를 사용하고,
    // oldScoreItem의 차트 점수/평점을 채웁니다.
    return {
        id: baseScoreStructure.id,
        imageUrl: baseScoreStructure.imageUrl,
        title: baseScoreStructure.title,
        pack: baseScoreStructure.pack,
        composer: baseScoreStructure.composer,
        chartDesigner: baseScoreStructure.chartDesigner, // Song의 chartDesigner 사용
        artwork: baseScoreStructure.artwork, // Song의 artwork 사용
        ver: baseScoreStructure.ver,
        charts: baseScoreStructure.charts.map((latestChartInfo, index) => {
            // oldScoreItem.charts 배열에서 해당 인덱스의 차트 데이터를 가져옵니다.
            const oldChartData = oldScoreItem.charts?.[index];

            return {
                difficulty: latestChartInfo.difficulty,
                const: latestChartInfo.const,
                score: oldChartData?.score ?? 0,
                rating: oldChartData?.rating ?? 0
            };
        })
    };
};
