export interface PaginationDatas<T> {
	pages: number;
	perPage: number;
	totalItems: number;
	currentPage: number;
	list: T[];
}
