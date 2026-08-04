import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';

export const load = async () => {
	const database = new ReignsRepository();
	const rankingByChampionships = await database.getRankingByChampionships();

	return {
		ranking: rankingByChampionships,
	};
};