import { ChampionshipDao } from '$lib/server/dao/championship.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ locals }) => {
	if (!Helpers.hasPermission(locals, 'admin')) throw Helpers.redirection('/login');
	const championships = await ChampionshipDao.getAdminChampionships();

	return {
		championships: championships.map((championship) => ({
			...championship,
			createdAt: championship.created_at?.toISOString(),
			updatedAt: championship.updated_at?.toISOString()
		}))
	};
};

export const actions = {
	toggleActive: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals, 'admin'))
			return Helpers.error('No tienes permiso para realizar esta acción');
		const form = await request.formData();
		const id = Helpers.getUpdateID(form);
		if (!id) return Helpers.error('ID inválido');

		try {
			const chp = await ChampionshipDao.getChampionshipByID(id);
			if (!chp) return Helpers.error('Campeonato no encontrado');

			await ChampionshipDao.updateActive(id, !chp.active);
			return Helpers.success('Campeonato actualizado');
		} catch (error) {
			return Helpers.error('Error al actualizar el campeonato');
		}
	}
};
