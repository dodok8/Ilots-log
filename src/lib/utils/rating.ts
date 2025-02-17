export function calculateSongRating(difficulty: number, score: number): number {
	let rating: number;

	if (score < 500000) {
		rating = 0;
	} else if (score < 900000) {
		rating = difficulty - (1000000 - score) / 100000;
	} else if (score < 950000) {
		rating = difficulty - 1 + (score - 900000) / 50000;
	} else if (score < 980000) {
		rating = difficulty + (score - 950000) / 30000;
	} else if (score < 1000000) {
		rating = difficulty + 1 + (score - 980000) / 20000;
	} else if (score < 1004000) {
		rating = difficulty + 2 + (score - 1000000) / 10000;
	} else if (score < 1008000) {
		rating = difficulty + 2.4 + (score - 1004000) / 4000;
	} else if (score < 1010000) {
		rating = difficulty + 3.4 + (score - 1008000) / 10000;
	} else {
		rating = difficulty + 3.4 + (1010000 - 1008000) / 10000;
	}

	// If the player fails, ensure the rating doesn't exceed 6.0
	if (score < 900000) {
		rating = Math.min(6.0, rating);
	}

	// If the rating is negative, set it to 0
	rating = Math.max(0, rating);

	// Round to four decimal places
	return Math.round(rating * 10000) / 10000;
}
