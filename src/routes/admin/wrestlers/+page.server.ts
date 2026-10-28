import { WrestlerConstants } from '$lib/constants/wrestler.constants';
import { wrestlers } from '$lib/server/dao/repositories/wrestler.repository.js';
import type { Prisma } from '@prisma/client';

export async function load({ url }) {
	const search = (url.searchParams.get('search') ?? '').trim().slice(0, 255);
	const requestedPage = Number(url.searchParams.get('page') ?? 1);
	const currentPage = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
	const genderFilter =
		WrestlerConstants.genders.find((option) => option.value === url.searchParams.get('gender'))
			?.value ?? '';
	const statusFilter =
		WrestlerConstants.statuses.find((option) => option.value === url.searchParams.get('status'))
			?.value ?? '';

	const filters: Prisma.WrestlerWhereInput = {};
	if (genderFilter) {
		filters.sex = genderFilter;
	}
	if (search) {
		filters.name = { contains: search };
	}
	if (statusFilter) {
		filters.status = statusFilter;
	}

	const [total, wrestlerList] = await wrestlers.paginate(
		currentPage,
		{
			orderBy: {
				name: 'asc'
			},
			where: filters
		},
		10
	);

	return {
		filters: {
			sex: genderFilter,
			status: statusFilter,
			search: search
		},
		page: currentPage,
		wrestlers: wrestlerList,
		total: total
	};
}
