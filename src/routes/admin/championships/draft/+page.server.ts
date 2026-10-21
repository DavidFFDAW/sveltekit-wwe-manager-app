import type { Actions } from './$types';
import { Helpers } from '$lib/server/server.helpers';
import { ChampionshipRepository } from '$lib/server/dao/repositories/championship.repository';
import { brandsArray } from '$lib/constants/app';
import FormService from '$lib/services/form.service';

export const load = (async ({ locals }) => {
	if (!Helpers.hasPermission(locals, 'admin'))
		throw Helpers.redirection('/login');

	const Champions = new ChampionshipRepository();
	const championships = await Champions.get({
		where: {
			active: true,
			type: { not: 'mitb' },
		},
		orderBy: [{ brand: 'asc' }, { order: 'asc' }, { name: 'asc' }]
	});

	return {
		championships
	};
});

export const actions: Actions = {
	update: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals, 'admin')) {
			return Helpers.error('No tienes permiso para realizar esta accion', 403);
		}

		try {
			const form = await FormService.fromRequest(request);
			const championships = form.getAll('championships[]').map(Number);
			if (championships.length === 0)
				return Helpers.error('No se han seleccionado campeonatos.', 400);

			const validBrands = brandsArray.map((brand) => brand.name as string);
			const championshipBrands = championships.map((id) => {
				const brand = form.get(`ch[${id}][brand]`);
				return { id, brand: validBrands.includes(brand) ? brand.toLowerCase() : 'other' };
			});

			const brandsChampionshipsMap = championshipBrands.reduce((acc, { id, brand }) => {
				if (!acc[brand]) acc[brand] = [];
				acc[brand] = [...acc[brand], id];
				return acc;
			}, {} as Record<string, number[]>);

			console.log({
				validBrands,
				championshipBrands,
				brandsChampionshipsMap
			});

			return Helpers.error('No se ha implementado aun la actualización de marcas de campeonatos.', 400);

			// const updates = parseBrandUpdates(form);
			// const Champions = new ChampionshipRepository();
			// const activeChampionships = await Champions.get({
			// 	...championshipsQuery,
			// 	select: { id: true }
			// });
			// const activeIds = new Set(activeChampionships.map((championship) => championship.id));
			// const safeUpdates = updates.filter((update) => activeIds.has(update.id));

			// if (safeUpdates.length !== updates.length) {
			// 	return Helpers.error('El reparto incluye campeonatos que no se pueden actualizar.', 400);
			// }

			// await Champions.conn().$transaction(
			// 	safeUpdates.map((update) =>
			// 		Champions.getModel().update({
			// 			where: { id: update.id },
			// 			data: { brand: update.brand }
			// 		})
			// 	)
			// );

			// return Helpers.success('Marcas de campeonatos actualizadas correctamente.');
		} catch (error) {
			console.error('Error updating championship brands:', error);
			return Helpers.error('Error al actualizar las marcas de los campeonatos.', 500);
		}
	}
} satisfies Actions;
