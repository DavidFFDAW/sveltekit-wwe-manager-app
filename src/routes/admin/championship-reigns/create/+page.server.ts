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

		fs.writeFileSync(
			'./src/routes/admin/championship-reigns/create/create-reigns-log.json',
			JSON.stringify(datas, null, 4)
		);

		if (!datas.date_won) return Helpers.error('Debes seleccionar una fecha de inicio', 400);
		if (!datas.championship.id) return Helpers.error('Debes seleccionar un campeonato', 400);

		if (datas.type === 'single') {
			if (!datas.wrestler.id) return Helpers.error('Debes seleccionar un luchador', 400);
		}
		if (datas.type === 'team') {
			if (!datas.team.id) return Helpers.error('Debes seleccionar un equipo', 400);
			if (!datas.team.members || datas.team.members.length > 2)
				return Helpers.error('Debes seleccionar dos miembros para el equipo', 400);
		}
		if (datas.type === 'no-team') {
			if (!datas.no_team)
				return Helpers.error('Debes seleccionar miembros para que sean campeones', 400);
			if (datas.no_team.members.ids.length < 1)
				return Helpers.error('Debes seleccionar dos miembros para el equipo', 400);
		}

		return Helpers.error('No se ha implementado la acción', 501);
	}
};
