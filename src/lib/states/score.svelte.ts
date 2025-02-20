import { getBest30, getBest30Average } from '$lib/utils/best';
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
					return existingScore;
				}
				// 새로운 곡에 대한 기본 스코어 생성
				return createEmptyScore(song);
			});
		}

		// 모든 곡이 존재하는지 확인
		if (savedScores.every((score) => songs.find((s) => s.id === score.id))) {
			return savedScores;
		}
	} catch (e) {
		console.error('Failed to process saved scores:', e);
	}

	// 실패시 새로 초기화
	return createInitialScores();
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
	best30Songs = $derived(getBest30(this.scores));
	best30Average = $derived(getBest30Average(this.best30Songs));
	targetRating = $derived(
		scores.best30Songs.length > 0
			? scores.best30Songs[scores.best30Songs.length - 1].rating + 0.3
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
