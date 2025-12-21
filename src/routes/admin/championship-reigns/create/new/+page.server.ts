import { PPVDao } from '$lib/server/dao/ppv.dao.js';
import { ChampionshipRepository } from '$lib/server/dao/repositories/championship.repository.js';
import { PPVRepository } from '$lib/server/dao/repositories/ppv.repository.js';
import { TeamsDao } from '$lib/server/dao/teams.dao';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ locals }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');
	const championships = new ChampionshipRepository();
	const ppvRepository = new PPVRepository();
	const ppvs = await ppvRepository.get({
		where: {
			active: true
		},
		orderBy: {
			game_date: 'asc'
		}
	});

	return {
		ppvs: [...ppvRepository.getWeeklyShows(), ...ppvs.map((p) => p.name)],
		teams: await TeamsDao.getReignSelectableTeams(),
		wrestlers: await WrestlerDao.filter({
			status: {
				not: 'injured'
			}
		}),
		championships: await championships.get({
			where: {
				active: true
			}
		})
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos suficientes para realizar esta acción');

		const formData = await request.formData();
		const object = Object.fromEntries(formData.entries());
		console.log({ formData: object });

		return Helpers.error('No se ha podido crear el reinado', 400);
	}
};
