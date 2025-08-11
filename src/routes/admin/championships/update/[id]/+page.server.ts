import { ChampionshipAdapter } from '$lib/server/adapters/championship.adapter';
import { ChampionshipDao } from '$lib/server/dao/championship.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ params, locals }) => {
	if (!Helpers.hasPermission(locals, 'admin')) throw Helpers.redirection('/login');
	const updateId = Number(params.id);
	if (!updateId || isNaN(updateId)) throw Helpers.redirection('/admin/championships');

	const chp = await ChampionshipDao.getAdminChampionshipByID(updateId);
	return { championship: chp };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals, 'admin'))
			return Helpers.error('No tienes permiso para realizar esta acción');
		const form = await request.formData();
		const id = Helpers.getUpdateID(form);
		if (!id || isNaN(id)) return Helpers.error('No hay un id para actualizar o es inválido');
		const { error, message } = Helpers.checkRequiredFields(
			form,
			ChampionshipAdapter.requiredFields
		);
		if (error) return Helpers.error(message);

		try {
			const data = ChampionshipAdapter.getTransformedObject(form);
			await ChampionshipDao.updateChampionship(id, data);
			return Helpers.success('Campeonato actualizado');
		} catch (error) {
			console.log(error);
			return Helpers.error('Error al actualizar el campeonato');
		}
	}
};
