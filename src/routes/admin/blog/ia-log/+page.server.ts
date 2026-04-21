import { IaRepository } from '$lib/server/dao/repositories/ia.repository.js'
import { Helpers } from '$lib/server/server.helpers';

export const load = async ({ url }) => { 
	const repository = new IaRepository();
	const searchPagination = Helpers.getPaginationFromSearchParams(url.searchParams);
	
	const { list, ...pagination } = await repository.paginateN(
		searchPagination.page,
		{
			orderBy: {
				created_at: 'desc'
			}
		},
		15
	);

	return {
		ia: {
			pagination,
			list
		}
	}
}