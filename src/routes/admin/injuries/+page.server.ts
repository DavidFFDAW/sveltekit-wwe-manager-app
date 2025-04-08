import injuries from '$lib/server/dao/injuries.js';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async () => {
	const wrestlers = await WrestlerDao.getWrestlers();
	const injuriesList = await injuries.getAll();

	return { wrestlers, injuries: injuriesList };
};

const commonDatasValidator = (formData: FormData) => {
	const { error, message } = Helpers.checkRequiredFields(formData, [
		'injury-name',
		'injury-dates',
		'injury-severity',
		'selected-injured-wrestler-resource-id'
	]);
	if (error) throw new Error(message);

	const wrestlerId = Number(formData.get('selected-injured-wrestler-resource-id'));
	if (!wrestlerId) throw new Error('El luchador es requerido');
	const dates = Helpers.getDateRange(formData, 'injury-dates');

	if (!dates.start || !dates.end) throw new Error('Las fechas son requeridas');
	if (dates.start > dates.end) {
		throw new Error('La fecha de inicio no puede ser mayor que la de fin');
	}

	return { dates, wrestlerId };
};

export const actions = {
	createInjury: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('No tienes permisos', 403);
		const formData = await request.formData();
		try {
			const { dates, wrestlerId } = commonDatasValidator(formData);
			const wrestler = await WrestlerDao.getWrestlerById(wrestlerId);
			if (!wrestler) return Helpers.error('No se ha encontrado el luchador', 404);

			await injuries.create({
				injury: formData.get('injury-name') as string,
				severity: formData.get('injury-severity') as string,
				start_date: dates.start,
				end_date: dates.end as Date,
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
	},
	updateInjury: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('No tienes permisos', 403);
		const formData = await request.formData();
		try {
			const { dates, wrestlerId } = commonDatasValidator(formData);
			const updateID = Helpers.getUpdateID(formData);
			const wrestler = await WrestlerDao.getWrestlerById(wrestlerId);
			if (!wrestler) return Helpers.error('No se ha encontrado el luchador', 404);

			await injuries.update(updateID, {
				injury: formData.get('injury-name') as string,
				severity: formData.get('injury-severity') as string,
				start_date: dates.start,
				end_date: dates.end as Date,
				Wrestler: {
					connect: {
						id: wrestlerId
					}
				}
			});

			await WrestlerDao.update(wrestlerId, {
				status: 'injured'
			});

			return Helpers.success('Lesion actualizada correctamente', 200);
		} catch (e) {
			console.error(e);
			return Helpers.error('No se ha podido crear esta lesion', 500);
		}
	}
};
