import { getBest40, getBest40Average } from '$lib/utils/best';
import type { Song } from '$lib/types/song';
import type { Score } from '$lib/types/score';
import songsData from '$lib/data/songs.json';

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
				const existingScore = existingScores.get(song.id);
				if (existingScore) {
					// 기존 점수를 유지하면서 최신 곡 정보와 병합
					return mergeScoreWithLatestSongData(song, existingScore);
				}
				// 새로운 곡에 대한 기본 스코어 생성
				return createEmptyScore(song);
			});
		}

		if (savedScores.every((score) => songs.find((s) => s.id === score.id))) {
			return savedScores.map((score) =>
				mergeScoreWithLatestSongData(songs.find((s) => s.id === score.id)!, score)
			);
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
		id: song.id,
		imageUrl: song.imageUrl,
		artist: song.artist,
		releaseVersion: song.releaseVersion,
		chapter: song.chapter,
		title_localized: song.title_localized,
		source_localized: song.source_localized,
		charts: song.charts.map((latestChart) => {
			// 기존 점수에서 해당 난이도의 차트 찾기
			const existingChart = existingScore.charts.find(
				(c) => c.difficultyLevel === latestChart.difficultyLevel
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
	id: song.id,
	imageUrl: song.imageUrl,
	artist: song.artist,
	releaseVersion: song.releaseVersion,
	chapter: song.chapter,
	title_localized: song.title_localized,
	source_localized: song.source_localized,
	charts: song.charts.map((chart) => ({
		...chart,
		score: 0,
		rating: 0
	}))
});

const createInitialScores = (): Score[] => songs.map(createEmptyScore);

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

	load(loadedScores: Score[]) {
		console.log('Loading scores...');
		console.log('Loaded scores count:', loadedScores.length);
		console.log('Current songs count:', songs.length);

		this.scores = initializeScores(loadedScores);
		this.save();

		console.log('Final scores count:', this.scores.length);
	}
}

const scores = new Scores();

export { scores };
