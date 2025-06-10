import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { Helpers } from '$lib/server/server.helpers.js';
import { getWrestlerOrTeamName, type ChampionshipReignMeta } from '$lib/utils/team.utils';

export const load = async ({ locals }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');

	const championshipReigns = await ReignsDao.getChampionshipReignsOrderedWithTeamNames();
	const groupedByChampionship = championshipReigns.reduce(
		(acc: Record<number, (typeof reign)[]>, reign) => {
			const championshipId = reign.Championship.id;
			if (!acc[championshipId]) {
				acc[championshipId] = [];
			}
			acc[championshipId].push(reign);
			return acc;
		},
		{}
	);

	return {
		reigns: Object.entries(groupedByChampionship)
	};
};
