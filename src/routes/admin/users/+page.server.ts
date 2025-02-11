import { UsersDao } from '$lib/server/dao/users.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ locals }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');
	return { users: await UsersDao.getAllUsers() };
};

export const actions = {};
