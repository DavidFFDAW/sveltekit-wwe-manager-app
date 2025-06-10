import { ReignsDao } from '$lib/server/dao/reigns.dao.js';
import DateUtils from '$lib/utils/date.utils.js';

export const load = async ({ locals }) => {
	const reigns = await ReignsDao.getCurrentChampionshipReign();
	const calculatedReigns = reigns.map((reign) => {
		return {
			...reign,
			calculated_days: DateUtils.getDaysBetweenDates(reign.won_date, reign.lost_date || new Date())
		};
	});
	return { reigns: calculatedReigns, user: locals.user };
};

export const actions = {};
