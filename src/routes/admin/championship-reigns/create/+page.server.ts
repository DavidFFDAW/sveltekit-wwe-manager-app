import { ReignsAdapter } from '$lib/server/adapters/reigns.adapter.js';
import { ChampionshipDao } from '$lib/server/dao/championship.dao.js';
import { PPVDao } from '$lib/server/dao/ppv.dao.js';
import { TeamsDao } from '$lib/server/dao/teams.dao';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';
import fs from 'fs';

export const load = async ({ locals }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');

	return {
		ppvs: await PPVDao.getPPVNames(),
		teams: await TeamsDao.getReignSelectableTeams(),
		wrestlers: await WrestlerDao.getReignSelectableWrestlers(),
		championships: await ChampionshipDao.getChampionships({
			select: { id: true, name: true, image: true, gender: true, tag: true }
		})
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos suficientes para realizar esta acción');

		const formData = await request.formData();
		const datas = ReignsAdapter.getCommonDatas(formData);
		fs.writeFileSync('./src/logs/create-reigns.json', JSON.stringify(datas, null, 4));

		return Helpers.error('No se ha implementado la acción', 501);
	}
};
