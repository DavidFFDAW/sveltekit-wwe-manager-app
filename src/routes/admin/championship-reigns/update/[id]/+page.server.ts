import { ReignsAdapter } from '$lib/server/adapters/reigns.adapter.js';
import { ChampionshipDao } from '$lib/server/dao/championship.dao.js';
import { PPVDao } from '$lib/server/dao/ppv.dao.js';
import { ReignsDao } from '$lib/server/dao/reigns.dao.js';
import { TeamsDao } from '$lib/server/dao/teams.dao';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';
import fs from 'fs';

export const load = async ({ locals, params, url }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');
	const searchID = params.id;
	const newDesign = url.searchParams.has('new-design');
	if (!searchID || isNaN(Number(searchID))) throw Helpers.redirection('/admin/championship-reigns');

	return {
		ppvs: await PPVDao.getPPVNames(),
		teams: await TeamsDao.getReignSelectableTeams(),
		reign: await ReignsDao.getChampionshipReignByID(Number(searchID)),
		wrestlers: await WrestlerDao.getReignSelectableWrestlers(),
		championships: await ChampionshipDao.getChampionships({
			select: { id: true, name: true, image: true, gender: true, tag: true }
		}),
		newDesign
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos suficientes para realizar esta acción');

		const formData = await request.formData();
		const datas = ReignsAdapter.getCommonDatas(formData);
		fs.writeFileSync('./src/logs/update-reign-fields.json', JSON.stringify(datas, null, 4));

		const reignID = Helpers.getUpdateID(formData);
		if (!reignID || isNaN(reignID))
			return Helpers.error('No se pudo obtener el ID del reinado', 400);

		return Helpers.error('No se ha implementado la acción', 501);
	}
};
