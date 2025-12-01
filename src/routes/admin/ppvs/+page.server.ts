import { PPVDao } from '$lib/server/dao/ppv.dao.js';
import { PPVRepository } from '$lib/server/dao/repositories/ppv.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';

const getFilters = (typeFilter: string) => {
	if (!typeFilter || typeFilter === 'all') return {};
	if (typeFilter === 'no-date') return { game_date: { equals: null } };
	if (typeFilter === 'to-be-announced') return { type: { equals: 'tbd' } };
	const activeBool = typeFilter === 'active';
	return { active: activeBool };
};

export async function load({ url }) {
	const params = url.searchParams;
	const activeFilter = params.has('type') ? params.get('type') : 'active';
	const searchFilter = params.get('search') || '';
	const filters = getFilters(activeFilter as string);

	const ppvRepo = new PPVRepository();

	return {
		ppvs: await ppvRepo.get({
			where: {
				...filters,
				name: { contains: searchFilter }
			},
			orderBy: [{ active: 'desc' }, { game_date: 'asc' }, { name: 'asc' }]
		}),
		filters: {
			search: searchFilter,
			type: activeFilter
		}
	};
}

export const actions = {
	async toggleActive({ request, locals }) {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Unauthorized', 401);
		const updatingId = Helpers.getUpdateID(await request.formData());

		try {
			const ppv = await PPVDao.toggleActive(updatingId);
			if (!ppv) return Helpers.error('No se ha encontrado el PPV', 404);

			return Helpers.success(
				`${ppv.name} ahora pasa a estar ${ppv.active ? 'activo' : 'inactivo'}`
			);
		} catch (error) {
			if (error instanceof Error) return Helpers.error(error.message);
		}
	},
	async deletePPV({ request, locals }) {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Unauthorized', 401);
		const deletingId = Helpers.getUpdateID(await request.formData());

		try {
			const ppv = await PPVDao.deleteById(deletingId);
			if (!ppv) return Helpers.error('No se ha encontrado el PPV', 404);

			return Helpers.success(`${ppv.name} ha sido eliminado`);
		} catch (error) {
			if (error instanceof Error) return Helpers.error(error.message);
		}
	}
};
