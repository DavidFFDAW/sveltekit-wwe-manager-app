export interface MatchObject {
	id: number;
	order: number;
	stipulation: string;
	championship: string;
	participants: string;
	night: number;
	type: 'create' | 'update' | 'delete';
}
