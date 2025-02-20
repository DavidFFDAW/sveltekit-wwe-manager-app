import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { ReignUtils } from '$lib/utils/reign.utils.js';

export const load = async () => {
	const reigns = await ReignsDao.getCurrentChampionshipReign();
	return {
		reigns: reigns.map((reign) => ({
			...reign,
			parsedDays: ReignUtils.getDaysAndMonths(reign.days),
			won_date: reign.won_date.toLocaleDateString('es-ES', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			})
		}))
	};
};

export const actions = {};
