import { ChampionshipRepository } from '$lib/server/dao/repositories/championship.repository';
import { Helpers } from '$lib/server/server.helpers';
import type { Actions, PageServerLoad } from './$types';

type ChampionshipBrand = 'raw' | 'smackdown' | 'awl' | 'other';
type ChampionshipBrandUpdate = {
	id: number;
	brand: ChampionshipBrand;
};

const allowedBrands: ChampionshipBrand[] = ['raw', 'smackdown', 'awl', 'other'];
const championshipsQuery = {
	where: {
		active: true,
		type: { not: 'mitb' }
	}
};

const parseBrandUpdates = (form: FormData): ChampionshipBrandUpdate[] => {
	const updates: ChampionshipBrandUpdate[] = [];

	for (const [key, value] of form.entries()) {
		const match = /^ch\[(\d+)\]\[brand\]$/.exec(key);
		if (!match) continue;
		if (typeof value !== 'string') throw new Error('Hay campeonatos con datos de marca invalidos.');

		const id = Number(match[1]);
		const brand = value as ChampionshipBrand;

		if (!id || !allowedBrands.includes(brand)) {
			throw new Error('Hay campeonatos con datos de marca invalidos.');
		}

		updates.push({ id, brand });
	}

	if (updates.length === 0) throw new Error('No se ha recibido ningun campeonato para actualizar.');

	return updates;
};

export const load = (async ({ locals }) => {
	if (!Helpers.hasPermission(locals, 'admin')) throw Helpers.redirection('/login');

	const Champions = new ChampionshipRepository();
	const championships = await Champions.get({
		...championshipsQuery,
		orderBy: [{ brand: 'asc' }, { order: 'asc' }, { name: 'asc' }]
	});

	return {
		championships
	};
}) satisfies PageServerLoad;

export const actions = {
	updateBrands: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals, 'admin')) {
			return Helpers.error('No tienes permiso para realizar esta accion', 403);
		}

		try {
			const form = await request.formData();
			const updates = parseBrandUpdates(form);
			const Champions = new ChampionshipRepository();
			const activeChampionships = await Champions.get({
				...championshipsQuery,
				select: { id: true }
			});
			const activeIds = new Set(activeChampionships.map((championship) => championship.id));
			const safeUpdates = updates.filter((update) => activeIds.has(update.id));

			if (safeUpdates.length !== updates.length) {
				return Helpers.error('El reparto incluye campeonatos que no se pueden actualizar.', 400);
			}

			await Champions.conn().$transaction(
				safeUpdates.map((update) =>
					Champions.getModel().update({
						where: { id: update.id },
						data: { brand: update.brand }
					})
				)
			);

			return Helpers.success('Marcas de campeonatos actualizadas correctamente.');
		} catch (error) {
			console.error('Error updating championship brands:', error);
			return Helpers.error('Error al actualizar las marcas de los campeonatos.', 500);
		}
	}
} satisfies Actions;
