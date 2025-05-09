export interface ChartInfo {
	id: string;
	title: string;
	imageUrl: string;
	difficulty: 'Ⅰ' | 'Ⅱ' | 'Ⅲ' | 'Ⅳ' | 'Ⅳ-α';
	const: number;
	score: number;
	rating: number;
}
