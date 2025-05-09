export interface Song {
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
	}[];
}

export interface OldSong {
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
	}[];
}
