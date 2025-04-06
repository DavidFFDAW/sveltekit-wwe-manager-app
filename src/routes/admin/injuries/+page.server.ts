import injuries from '$lib/server/dao/injuries.js';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { Utils } from '$lib/utils/general.utils.js';

export const load = async () => {
	const wrestlers = await WrestlerDao.getWrestlers();
	const injuriesList = await injuries.getAll();

	return { wrestlers, injuries: injuriesList };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('No tienes permisos', 403);
		const formData = await request.formData();
		const { error, message } = Helpers.checkRequiredFields(formData, [
			'injury-name',
			'injury-dates',
			'injury-severity',
			'selected-injured-wrestler-resource-id'
		]);
		if (error) return Helpers.error(message, 400);

		const wrestlerId = Number(formData.get('selected-injured-wrestler-resource-id'));
		const dates = Helpers.getDateRange(formData, 'injury-dates');
		console.log({
			dates,
			wrestlerId
		});

		if (!dates.start || !dates.end) return Helpers.error('Las fechas son requeridas', 400);
		if (dates.start > dates.end) {
			return Helpers.error('La fecha de inicio no puede ser mayor que la de fin', 400);
		}

		try {
			const wrestler = await WrestlerDao.getWrestlerById(wrestlerId);
			if (!wrestler) return Helpers.error('No se ha encontrado el luchador', 404);

			await injuries.create({
				injury: formData.get('injury-name') as string,
				severity: formData.get('injury-severity') as string,
				start_date: dates.start,
				end_date: dates.end,
				Wrestler: {
					connect: {
						id: wrestlerId
					}
				}
			});
			await WrestlerDao.update(wrestlerId, {
				status: 'injured'
			});

			return Helpers.success('Lesion creada correctamente', 200);
		} catch (e) {
			console.error(e);
			return Helpers.error('No se ha podido crear esta lesion', 500);
		}
	}
};
