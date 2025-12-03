import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';
import type { Prisma } from '@prisma/client';

export async function load({ url }) {
	const wrestlerRepository = new WrestlerRepository();
	const search = url.searchParams.has('search') ? (url.searchParams.get('search') as string) : '';
	const currentPage = url.searchParams.has('page') ? Number(url.searchParams.get('page')) : 1;
	const genderFilter = url.searchParams.has('gender') ? url.searchParams.get('gender') : '';
	const statusFilter = url.searchParams.has('status') ? url.searchParams.get('status') : '';

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

	const [total, wrestlers] = await wrestlerRepository.paginate(
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
		wrestlers: wrestlers,
		total: total
	};
}

export const actions = {
	// updateStatus: async ({ request }) => {
	// 	const datas = await request.formData();
	// 	const updatingID = Number(datas.get('_update_id'));
	// 	if (!updatingID) return Helpers.error('No se ha encontrado el luchador a actualizar');
	// 	if (!datas.has('status')) return Helpers.error('No se ha encontrado el estado a actualizar');

	// 	try {
	// 		const updatedWrestler = await WrestlerDao.updatePartialWrestler(
	// 			{ status: datas.get('status') },
	// 			updatingID
	// 		);
	// 		if (updatedWrestler) return Helpers.success('Luchador actualizado correctamente');
	// 	} catch (error: unknown) {
	// 		if (error instanceof Error) return Helpers.error(`Error:: ${error.message}`, 500);
	// 	}
	// }
	default: async ({ request }) => {
		const datas = await request.formData();

		try {
			const repository = new WrestlerRepository();
			const updateId = Number(datas.get('_update_id'));
			if (!updateId) return Helpers.error('No se ha encontrado el luchador a actualizar');

			const updatedWrestler = await repository.updateById(updateId, {
				status: datas.get('status') as string,
				overall: datas.get('overall') ? Number(datas.get('overall')) : undefined,
				name: datas.get('name') as string
			});
			if (!updatedWrestler) return Helpers.error('No se ha podido actualizar el luchador', 500);
			return Helpers.success('Luchador actualizado correctamente');
		} catch (error: unknown) {
			console.log(error);
			if (error instanceof Error) return Helpers.error(`Error:: ${error.message}`, 500);
		}
	}
};
