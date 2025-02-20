import { ChampionshipAdapter } from '$lib/server/adapters/championship.adapter';
import { ChampionshipDao } from '$lib/server/dao/championship.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';
import type { Prisma } from '@prisma/client';

export const load = async ({ locals }) => {
	if (!Helpers.hasPermission(locals, 'admin')) throw Helpers.redirection('/login');
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals, 'admin'))
			return Helpers.error('No tienes permiso para realizar esta acción');

		const form = await request.formData();
		const { error, message } = Helpers.checkRequiredFields(
			form,
			ChampionshipAdapter.requiredFields
		);
		if (error) return Helpers.error(message);

		try {
			const data = ChampionshipAdapter.getTransformedObject(form);
			await ChampionshipDao.createChampionship(data as Prisma.ChampionshipUncheckedCreateInput);
			return Helpers.success('Campeonato creado');
		} catch (error) {
			return Helpers.error('Error al crear el campeonato');
		}
	}
};
