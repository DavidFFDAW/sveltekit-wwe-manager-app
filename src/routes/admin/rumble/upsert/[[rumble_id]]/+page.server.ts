import { rumble, wrestlers } from '$lib/server/dao/repositories';
import FormService from '$lib/services/form.service';
import type { Prisma, Rumble } from '@prisma/client';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ params }) => {
	const { rumble_id } = params;
	const rumbleId = Number(rumble_id);
	const isUpdate = Boolean(rumbleId) && Number.isNaN(rumbleId) === false;

	const rumbleData = isUpdate
		? await rumble.getById(rumbleId)
		: {} as Rumble;

	const wrestlerList = await wrestlers.getNonReleasedWrestlers({
		select: { id: true, name: true, image_name: true, overall: true, sex: true }
	});

	return {
		isUpdate,
		id: rumbleId,
		rumble: rumbleData,
		wrestlers: wrestlerList.map(w => ({ ...w, image: w.image_name as string })),
		currentYear: new Date().getFullYear()
	};
}

export const actions = {
	upsert: async ({ request, params }) => {
		const rumbleId = Number(params.rumble_id);
		const isUpdate = Boolean(rumbleId) && Number.isNaN(rumbleId) === false;
		try {
			const datas = await FormService.fromRequest(request);
			const rumbleData: Prisma.RumbleCreateInput = {
				year: datas.get('year'),
				winner: {
					connect: {
						id: datas.getNumber('winner_id'),
					}
				},
				entry_number: datas.getNumber('entry_number'),
				successful: datas.getToggle('successful'),
			};

			const result = isUpdate
				? await rumble.updateById(rumbleId, rumbleData)
				: await rumble.create(rumbleData);

			if (!result || !result.id)
				return Helpers.error('Ha ocurrido algo inesperado y no se pudo procesar la solicitud');
			return Helpers.success('Operación realizada con éxito');

		} catch (error) {
			console.error('Error in rumble upsert action', error);
			return Helpers.error('An unexpected error occurred');
		}
	}
};