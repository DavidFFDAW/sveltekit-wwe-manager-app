import { rumble } from '$lib/server/dao/repositories/rumble.repository.js';
import { wrestlers } from '$lib/server/dao/repositories/wrestler.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ locals, url, route, depends }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/admin/login');
	depends(url.pathname);

	const rumbles = await rumble.get({
		include: {
			winner: true
		},
		orderBy: {
			year: 'asc'
		}
	});

	const wrestlerList = await wrestlers.get({
		select: { id: true, name: true, sex: true, brand: true },
		where: { status: { not: 'released' } },
		orderBy: { name: 'asc' }
	});

	return {
		rumbles,
		wrestlers: wrestlerList,
		metas: {
			title: 'Royal Rumble'
		}
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/admin/login');

		const formData = await request.formData();
		const { error, message } = Helpers.checkRequiredFields(
			formData,
			rumble.getRequiredFields()
		);
		if (error) return Helpers.error(message, 400);

		const currentYear = new Date().getFullYear();
		const winner = Number(formData.get('winner_id'));
		const year = Number(formData.get('year'));
		if (!winner || isNaN(winner)) {
			return Helpers.error('Selecciona un luchador válido como ganador', 400);
		}

		try {
			await rumble.create({
				winner: {
					connect: { id: winner }
				},
				year: (year ? year : currentYear).toString(),
				entry_number: Number(formData.get('entry_number')) || 25,
				successful: Helpers.getToggleInput(formData, 'successful')
			});
			return Helpers.success('Ganador creado correctamente', 201);
		} catch (error) {
			return Helpers.error('Funcionalidad en desarrollo', 500);
		}
	}
};
