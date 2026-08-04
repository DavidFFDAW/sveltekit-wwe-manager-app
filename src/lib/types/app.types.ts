export interface PaginationDatas<T> {
	pages: number;
	perPage: number;
	totalItems: number;
	currentPage: number;
	list: T[];
}

export interface RankingReign {
	total_reigns: number;
	total_days: number;
	wrestler_id: number;
	name: string;
	wrestler_image: string;
}

export interface RankingChampionshipReign {
	times_won: number;
	total_days: number;
	name: string;
	wrestler_image: string;
	championship_name: string;
	championship_id: number;
	championship_image: string;
}