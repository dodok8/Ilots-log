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
		rating = difficulty + 3.4 + (score - 1008000) / 9995;
	} else {
		rating = difficulty + 3.7;
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

export function calculateRequiredScore(difficulty: number, targetRating: number): number {
	// 목표 레이팅이 난이도+3.7보다 높으면 달성 불가능
	if (targetRating > difficulty + 3.7) {
		return -1; // 불가능한 목표
	}

	// 목표 레이팅이 0이면 500000점 미만이면 됨
	if (targetRating <= 0) {
		return 0;
	}

	let requiredScore: number;

	if (targetRating <= difficulty - 1) {
		// 900000점 미만 구간
		requiredScore = 1000000 - (difficulty - targetRating) * 100000;
	} else if (targetRating <= difficulty) {
		// 900000-950000점 구간
		requiredScore = 900000 + (targetRating - (difficulty - 1)) * 50000;
	} else if (targetRating <= difficulty + 1) {
		// 950000-980000점 구간
		requiredScore = 950000 + (targetRating - difficulty) * 30000;
	} else if (targetRating <= difficulty + 2) {
		// 980000-1000000점 구간
		requiredScore = 980000 + (targetRating - (difficulty + 1)) * 20000;
	} else if (targetRating <= difficulty + 2.4) {
		// 1000000-1004000점 구간
		requiredScore = 1000000 + (targetRating - (difficulty + 2)) * 10000;
	} else if (targetRating <= difficulty + 3.4) {
		// 1004000-1008000점 구간
		requiredScore = 1004000 + (targetRating - (difficulty + 2.4)) * 4000;
	} else if (targetRating < difficulty + 3.6) {
		// 1008000-1010000점 구간
		requiredScore = 1008000 + (targetRating - (difficulty + 3.4)) * 10000;
	} else {
		// 1010000점(이론치)
		requiredScore = 1010000;
	}

	// 점수를 정수로 반올림
	return Math.ceil(requiredScore);
}
