import { ppv } from '$lib/server/dao/repositories/ppv.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import FormService from '$lib/services/form.service';

export const load = async () => {
	return {
		ppvs: await ppv.get({
			where: { active: true },
			orderBy: { annual_order: 'asc' }
		})
	};
};

export const actions = {
	createPPV: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Unauthorized', 401);
		const form = await FormService.fromRequest(request);

		const requiredFields = ['name', 'game_date'];
		const { error, message } = form.checkRequiredFields(requiredFields);
		if (error) return Helpers.error(message, 400);

		try {
			const gameDate = new Date(form.get('game_date') + 'T21:00:00Z');
			const existing = await ppv.exists({
				OR: [
					{ name: form.get('name') as string },
					{ game_date: gameDate }
				]
			});

			if (existing)
				return Helpers.error('Ya existe un PPV con ese nombre o en la misma fecha', 400);

			const createdPPV = await ppv.create({
				name: form.get('name') as string,
				game_date: gameDate,
				annual_order: ppv.getAnnualOrder(gameDate),
				active: form.getToggle('active'),
				image: form.get('image') as string,
				stadium: form.get('stadium') as string,
				city: form.get('city') as string,
				type: form.get('ppv_type') as string,
				estimated_real_date: gameDate,
				abbreviation: form.get('abbreviation') as string,
				specific_match_type: form.get('specific_match') as string,
				description: form.get('description') as string
			});

			if (!createdPPV) return Helpers.error('Error creando el PPV', 500);
			return Helpers.success('PPV creado correctamente');
		} catch (error) {
			console.error(error);
			return Helpers.error('Error creando el PPV', 500);
		}
	}
};
