import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ locals }) => {
	console.log({ locals });
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');

	const championshipReigns = await ReignsDao.getChampionshipReigns();
	const parsedDatas = championshipReigns.map((reign) => ({
		...reign,
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
