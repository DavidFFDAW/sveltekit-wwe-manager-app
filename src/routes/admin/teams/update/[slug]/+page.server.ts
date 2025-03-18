import { TeamsDao } from '$lib/server/dao/teams.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ params }) => {
	const { slug } = params;
	if (!slug) return Helpers.redirection('/admin/teams');

	return { team: await TeamsDao.getReignBySlug(slug) };
};

export const actions = {};
