import { ReignsAdapter, type CommonDatas } from '$lib/server/adapters/reigns.adapter.js';
import { ChampionshipDao } from '$lib/server/dao/championship.dao.js';
import { PPVDao } from '$lib/server/dao/ppv.dao.js';
import { TeamsDao } from '$lib/server/dao/teams.dao';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ locals }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');
	const ppvs = await PPVDao.getOrderedPPVNames({
		active: true,
		visible: true
	});

	return {
		ppvs: [...PPVDao.weeklyShows, ...ppvs],
		teams: await TeamsDao.getReignSelectableTeams(),
		wrestlers: await WrestlerDao.filter({
			status: {
				not: 'injured'
			}
		}),
		championships: await ChampionshipDao.getChampionships()
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
