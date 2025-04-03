import injuries from '$lib/server/dao/injuries.js';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { Utils } from '$lib/utils/general.utils.js';
import type { Injuries } from '@prisma/client';

export const load = async () => {
	const wrestlers = await WrestlerDao.getWrestlers();
	// const injuriesList = await injuries.getAll();
	const injuriesList: Injuries[] = [];

	return { wrestlers, injuries: injuriesList };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('No tienes permisos', 403);
		const formData = await request.formData();
		const object = Object.fromEntries(formData.entries());
		const { error, message } = Helpers.checkRequiredFields(formData, [
			'name',
			'end-date',
			'severity',
			'selected-injured-wrestler-resource-id'
		]);
		const wrestlerId = Number(formData.get('selected-injured-wrestler-resource-id'));
		const startDate = formData.get('start-date') as string | null;

		const dates = {
			start: Utils.getLocalDate(startDate || new Date()),
			end: Utils.getLocalDate(formData.get('end-date') as string)
		};
		console.log({ object, message, error, dates });

		if (error) return Helpers.error(message, 400);
		if (dates.start > dates.end) {
			return Helpers.error('La fecha de inicio no puede ser mayor que la de fin', 400);
		}

		try {
			await injuries.create({
				injury: formData.get('name') as string,
				severity: formData.get('severity') as string,
				start_date: dates.start,
				end_date: dates.end,
				Wrestler: {
					connect: {
						id: wrestlerId
					}
				}
			});
			const updatedWrestler = await WrestlerDao.update(wrestlerId, {
				status: 'injured'
			});

			return Helpers.success(`${updatedWrestler.name} se ha lesionado`, 200);
		} catch (e) {
			console.error(e);
			return Helpers.error('No se ha podido crear esta lesion', 500);
		}
	}
};
