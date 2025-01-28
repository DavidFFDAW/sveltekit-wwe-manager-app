import { BlogDao } from '$lib/server/dao/blog.dao';
import { Helpers } from '$lib/server/server.helpers';

export const load = async ({ locals }) => {
	if (!locals.user) throw Helpers.redirection('/admin/dashboard');
	return {
		posts: await BlogDao.getOrderedPosts()
	};
};

export const actions = {};
