import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export async function load({ url }) {
	const wrestlerRepository = new WrestlerRepository();
	const search = url.searchParams.has('search') ? (url.searchParams.get('search') as string) : '';
	const currentPage = url.searchParams.has('page') ? Number(url.searchParams.get('page')) : 1;
	const [total, wrestlers] = await wrestlerRepository.paginate(
		currentPage,
		{
			orderBy: {
				name: 'asc'
			},
			where: {
				name: {
					contains: search
				}
			}
		},
		10
	);

	return {
		search,
		page: currentPage,
		wrestlers: wrestlers,
		total: total
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
