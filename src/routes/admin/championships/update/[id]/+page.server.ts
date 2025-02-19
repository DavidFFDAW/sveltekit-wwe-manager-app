import { ChampionshipDao } from '$lib/server/dao/championship.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ params, locals }) => {
	if (!Helpers.hasPermission(locals, 'admin')) throw Helpers.redirection('/login');
	const updateId = Number(params.id);
	if (!updateId || isNaN(updateId)) throw Helpers.redirection('/admin/championships');

	const chp = await ChampionshipDao.getAdminChampionshipByID(updateId);
	return { championship: chp };
};

export const actions = {};
