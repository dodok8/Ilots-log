export interface Score {
	id: string;
	imageUrl: string;
	artist: string;
	releaseVersion: string;
	chapter: string;
	title_localized: Record<string, string>;
	source_localized?: {
		default: string;
	};
	charts: {
		difficultyLevel: string;
		difficultyDecimal: number;
		chartDesigner: string;
		jacketDesigner: string;
		score: number;
		rating: number;
	}[];
}
