import { TeamsDao } from '$lib/server/dao/teams.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';
import type { Prisma } from '@prisma/client';

export async function load({ url }) {
	const search = url.searchParams;
	const params = {
		name: search.get('search') || '',
		status: search.get('status') || null
	};

	const where: Prisma.TeamWhereInput = {
		OR: [
			{ name: { contains: params.name } },
			{
				WrestlerTeam: {
					some: {
						Wrestler: {
							name: { contains: params.name }
						}
					}
				}
			}
		],
		active: params.status ? params.status === 'active' : undefined
	};

	return { params: params, teams: await TeamsDao.getAdminTeams(where) };
}

export const actions = {
	toggleVisibility: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para realizar esta acción', 403);

		const datas = await request.formData();
		const updateId = Helpers.getUpdateID(datas);

		try {
			const result = await TeamsDao.toggleActive(updateId);
			if (!result) return Helpers.error('No se ha podido actualizar el registro', 404);
			return Helpers.success('Registro actualizado correctamente');
		} catch (error) {
			console.error(error);
			return Helpers.error('No se ha podido actualizar el registro', 404);
		}
	}
	// default: async ({ request }) {
	//     const datas = await request.formData();
	//     return { result: datas };
	// }
};
