export type Score = {
	title: string;
	id: string;
	imageUrl: string;
	pack: string;
	composer: string;
	chartDesigner: string;
	artwork: string;
	ver: string;
	charts: {
		difficulty: 'Ⅰ' | 'Ⅱ' | 'Ⅲ' | 'Ⅳ' | 'Ⅳ-α';
		const: number;
		score: number;
		rating: number;
	}[];
};

export interface OldScore {
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
