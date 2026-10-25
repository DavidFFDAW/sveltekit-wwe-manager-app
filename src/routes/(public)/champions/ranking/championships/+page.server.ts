import { reigns } from '$lib/server/dao/repositories/reigns.repository';

export const load = async () => {

	const rankingByChampionships = await reigns.getRankingByChampionships();

	return {
		ranking: rankingByChampionships,
	};
};
