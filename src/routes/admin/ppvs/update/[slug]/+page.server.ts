import { PPVDao } from '$lib/server/dao/ppv.dao.js';
import { ppv } from '$lib/server/dao/repositories/ppv.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import FormService from '$lib/services/form.service';

export const load = async ({ params }) => {
	const slug = Number(params.slug);
	if (!slug) return Helpers.redirection('/admin/ppvs');
	if (Number.isNaN(slug)) return Helpers.redirection('/admin/ppvs');

	return {
		ppvs: await PPVDao.getActivePPVs(),
		currentPPV: await PPVDao.getPPVByID(slug)
	};
};

export const actions = {
	updatePPV: async ({ request, locals, params }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Unauthorized', 401);
		const slug = Number(params.slug);
		if (!slug) return Helpers.error('PPV no encontrado', 404);
		if (Number.isNaN(slug)) return Helpers.error('PPV no encontrado', 404);

		const formData = await FormService.fromRequest(request);
		const requiredFields = ['name', 'game_date'];
		const { error, message } = formData.checkRequiredFields(requiredFields);
		if (error) return Helpers.error(message, 400);

		try {
			const gameDate = new Date(formData.get('game_date') + 'T21:00:00Z');
			const exists = await ppv.exists({
				AND: [
					{
						OR: [
							{ name: formData.get('name') as string },
							{ game_date: gameDate }
						]
					},
					{ id: { not: slug } }
				]
			});

			if (exists)
				return Helpers.error('Ya existe un PPV con ese nombre o en la misma fecha', 400);

			const createdPPV = await PPVDao.updatePPV(slug, {
				name: formData.get('name') as string,
				game_date: gameDate,
				active: formData.getToggle('active'),
				annual_order: ppv.getAnnualOrder(gameDate),
				image: formData.get('image') as string,
				stadium: formData.get('stadium') as string,
				city: formData.get('city') as string,
				type: formData.get('ppv_type') as string,
				estimated_real_date: gameDate,
				abbreviation: formData.get('abbreviation') as string,
				specific_match_type: formData.get('specific_match') as string,
				description: formData.get('description') as string
			});

			if (!createdPPV) return Helpers.error('Error actualizando el PPV', 500);
			return Helpers.success('PPV actualizado correctamente');
		} catch (error) {
			console.error(error);
			return Helpers.error('Error actualizando el PPV', 500);
		}
	}
};
