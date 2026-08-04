import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';

export const load = async () => {
	const database = new ReignsRepository();
	const rankingByWrestler = await database.getRankingByWrestler();

	return {
		ranking: rankingByWrestler,
	};
};