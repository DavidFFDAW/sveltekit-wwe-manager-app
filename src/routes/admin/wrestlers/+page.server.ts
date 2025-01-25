import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import prisma from '$lib/server/prisma';
import { Helpers } from '$lib/server/server.helpers.js';

export async function load({ url }) {
	const search = url.searchParams.has('search') ? (url.searchParams.get('search') as string) : '';
	const currentPage = url.searchParams.has('page') ? Number(url.searchParams.get('page')) : 1;
	const offset = currentPage - 1;
	const limit = 10;

	return {
		search,
		page: currentPage,
		wrestlers: await prisma.wrestler.findMany({
			orderBy: {
				name: 'asc'
			},
			where: {
				name: {
					contains: search
				}
			},

			take: limit,
			skip: offset * limit
		}),
		total: await prisma.wrestler.count({
			where: {
				name: {
					contains: search
				}
			}
		})
	};
}

export const actions = {
	updateStatus: async ({ request }) => {
		const datas = await request.formData();
		const updatingID = Number(datas.get('_update_id'));
		if (!updatingID) return Helpers.error('No se ha encontrado el luchador a actualizar');
		if (!datas.has('status')) return Helpers.error('No se ha encontrado el estado a actualizar');

		try {
			const updatedWrestler = await WrestlerDao.updatePartialWrestler(
				{ status: datas.get('status') },
				updatingID
			);
			if (updatedWrestler) return Helpers.success('Luchador actualizado correctamente');
		} catch (error: unknown) {
			if (error instanceof Error) return Helpers.error(`Error:: ${error.message}`, 500);
		}
	}
};
