import { getBest40, getBest40Average } from '$lib/utils/best';
import type { Song } from '$lib/types/song';
import type { OldScore, Score } from '$lib/types/score';
import songsData from '$lib/data/songs.json';
import { convertOldScoreArrayToNewScoreArray } from '$lib/utils/convtert'; // 경로 확인

const songs = songsData as Song[];
const STORAGE_KEY = 'rotaeno-scores';

// Song[] -> Score[] 변환
const initializeScores = (savedScores?: Score[]): Score[] => {
	// 저장된 스코어가 없으면 초기화
	if (!savedScores || !Array.isArray(savedScores)) {
		return createInitialScores();
	}

	try {
		// 저장된 스코어와 현재 곡 데이터 비교
		if (savedScores.length < songs.length) {
			console.log('Migrating scores from older version...');
			// 기존 스코어를 Map으로 변환
			const existingScores = new Map(savedScores.map((score) => [score.id, score]));

			// 모든 곡에 대해 새로운 배열 생성
			return songs.map((song) => {
				const existingScore = existingScores.get(song.title);
				if (existingScore) {
					// 기존 점수를 유지하면서 최신 곡 정보와 병합
					return mergeScoreWithLatestSongData(song, existingScore);
				}
				// 새로운 곡에 대한 기본 스코어 생성
				return createEmptyScore(song);
			});
		}

		// 모든 곡이 존재하는지 확인 (이 부분도 병합 로직을 적용할 수 있음)
		// 만약 저장된 데이터가 최신 곡 정보와 다를 수 있다면, 여기서도 병합 로직 적용 고려
		if (savedScores.every((score) => songs.find((s) => s.title === score.title))) {
			// 필요하다면 여기서도 모든 savedScores 항목에 대해 mergeScoreWithLatestSongData 적용
			// 예: return savedScores.map(score => mergeScoreWithLatestSongData(songs.find(s => s.id === score.id)!, score));
			// 현재는 그대로 반환
			return savedScores;
		}
	} catch (e) {
		console.error('Failed to process saved scores:', e);
	}

	// 실패시 새로 초기화
	return createInitialScores();
};

// 기존 점수와 최신 곡 정보를 병합하는 함수
const mergeScoreWithLatestSongData = (song: Song, existingScore: Score): Score => {
	// 최신 곡 정보 기반으로 기본 Score 객체 생성
	const newScore: Score = {
		...song,
		charts: song.charts.map((latestChart) => {
			// 기존 점수에서 해당 난이도의 차트 찾기
			const existingChart = existingScore.charts.find(
				(c) => c.difficulty === latestChart.difficulty
			);
			// 기존 점수가 있으면 점수와 레이팅 유지, 없으면 0으로 초기화
			return {
				...latestChart,
				score: existingChart?.score ?? 0,
				rating: existingChart?.rating ?? 0
			};
		})
	};
	return newScore;
};

// 새로운 헬퍼 함수들
const createEmptyScore = (song: Song): Score => ({
	...song,
	charts: song.charts.map((chart) => ({
		...chart,
		score: 0,
		rating: 0
	}))
});

const createInitialScores = (): Score[] => songs.map(createEmptyScore);

// OldScore 타입인지 확인하는 간단한 타입 가드 (더 견고하게 만들 수 있음)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isOldScoreArray(data: any[]): data is OldScore[] {
	if (data.length === 0) return false;
	// OldScore에만 있는 고유한 속성으로 확인 (예: title_localized, artist)
	const firstItem = data[0];
	return (
		firstItem &&
		typeof firstItem.title_localized === 'object' &&
		typeof firstItem.artist === 'string' &&
		firstItem.charts?.[0]?.difficultyLevel !== undefined
	);
}

class Scores {
	scores: Score[] = $state([]);
	best40Songs = $derived(getBest40(this.scores));
	best40Average = $derived(getBest40Average(this.best40Songs));
	targetRating = $derived(
		scores.best40Songs.length > 0
			? scores.best40Songs[scores.best40Songs.length - 1].rating + 0.04
			: 0
	);

	constructor() {
		// 서버 사이드에서는 빈 배열로 초기화
		if (typeof window === 'undefined') {
			this.scores = [];
			return;
		}

		try {
			const savedScores = localStorage.getItem(STORAGE_KEY);
			const parsedScores = savedScores ? JSON.parse(savedScores) : undefined;
			this.scores = initializeScores(parsedScores);
		} catch (error) {
			console.error('Failed to load scores from localStorage:', error);
			this.scores = initializeScores();
		}
	}

	save() {
		if (typeof window !== 'undefined') {
			console.log('saved!');
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.scores));
		}
	}

	reset() {
		if (typeof window !== 'undefined') {
			console.log('reset!');
			localStorage.removeItem(STORAGE_KEY);
			this.scores = initializeScores();
		}
	}

	load(loadedScoresInput: Score[] | OldScore[]) {
		console.log('Loading scores...');
		console.log('Loaded scores count:', loadedScoresInput.length);
		console.log('Current songs count:', songs.length);

		let scoresToInitialize: Score[];

		if (isOldScoreArray(loadedScoresInput)) {
			console.log('Detected OldScore format, converting to new Score format...');
			scoresToInitialize = convertOldScoreArrayToNewScoreArray(loadedScoresInput);
		} else {
			scoresToInitialize = loadedScoresInput as Score[];
		}

		this.scores = initializeScores(scoresToInitialize);
		this.save();

		console.log('Final scores count:', this.scores.length);
	}
}

const scores = new Scores();

export { scores };
