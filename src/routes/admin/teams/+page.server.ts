import { TeamsDao } from '$lib/server/dao/teams.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export async function load() {
	return { teams: await TeamsDao.getTeams() };
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
