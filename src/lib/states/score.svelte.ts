import { getBest30, getBest30Average } from '$lib/utils/best';
import type { Song } from '$lib/types/song';
import type { Score } from '$lib/types/score';
import songsData from '$lib/data/songs.json';

const songs = songsData as Song[];
const STORAGE_KEY = 'rotaeno-scores';

// Song[] -> Score[] 변환
const initializeScores = (savedScores?: Score[]): Score[] => {
	if (savedScores) {
		try {
			const parsed = savedScores;

			// If saved scores exist but have fewer songs than current data
			if (parsed.length < songs.length) {
				// Keep existing scores
				const existingScores = new Map(parsed.map((score) => [score.id, score]));

				// Create new scores for additional songs
				return songs.map((song) => {
					const existingScore = existingScores.get(song.id);
					if (existingScore) {
						return existingScore;
					}
					// Create new score entry for new songs
					return {
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
					};
				});
			}

			// If lengths match and all songs exist, return parsed scores
			if (parsed.every((score) => songs.find((s) => s.id === score.id))) {
				return parsed;
			}
		} catch (e) {
			console.error('Failed to parse saved scores:', e);
		}
	}

	// Fall back to initial scores if localStorage is empty or invalid
	return songs.map((song) => ({
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
	}));
};

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
		const savedScores = localStorage.getItem(STORAGE_KEY)
			? JSON.parse(localStorage.getItem(STORAGE_KEY) as string)
			: undefined;
		this.scores = initializeScores(savedScores);
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
		console.log('loaded!');
		this.scores = initializeScores(loadedScores);
		this.save();
	}
}

const scores = new Scores();

export { scores };
