import { reigns } from '$lib/server/dao/repositories/reigns.repository';

export const load = async () => {

	const rankingByWrestler = await reigns.getRankingByWrestler();

	return {
		ranking: rankingByWrestler,
	};
};
