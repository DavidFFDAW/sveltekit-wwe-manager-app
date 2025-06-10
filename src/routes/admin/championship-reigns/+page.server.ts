import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { Helpers } from '$lib/server/server.helpers.js';
import { getWrestlerOrTeamName, type ChampionshipReignMeta } from '$lib/utils/team.utils';

export const load = async ({ locals }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');

	const championshipReigns = await ReignsDao.getChampionshipReigns();
	const parsedDatas = championshipReigns.map((reign) => ({
		...reign,
		team_name: reign.Championship.tag
			? getWrestlerOrTeamName(reign as ChampionshipReignMeta)
			: reign.Wrestler.name,
		won_date: reign.won_date.toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: '2-digit'
		}),
		lost_date: reign.lost_date
			? reign.lost_date.toLocaleDateString('es-ES', {
					year: 'numeric',
					month: 'long',
					day: '2-digit'
				})
			: null
	}));

	return {
		reigns: parsedDatas
	};
};
