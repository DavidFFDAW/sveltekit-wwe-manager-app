import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async () => {
	return { reigns: await ReignsDao.getCurrentChampionshipReign() };
};

export const actions = {
	updateDefences: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para realizar esta acción');

		const datas = await request.formData();
		const allReigns = datas.getAll('reigns[]');

		if (!allReigns.length || allReigns.length === 0)
			return Helpers.error('No se han seleccionado reinados para añadir defensas titulares');
		const numericReigns = allReigns.map((reign) => Number(reign)).filter((reign) => !isNaN(reign));

		try {
			await ReignsDao.updateDefencesFor(numericReigns);
			return Helpers.success('Defensas actualizadas correctamente');
		} catch (error) {
			console.error(error);

			return Helpers.error('Ha ocurrido un error al actualizar las defensas');
		}
	}
};
