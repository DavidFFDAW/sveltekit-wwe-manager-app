import { BlogDao } from '$lib/server/dao/blog.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ locals, params }) => {
	if (!locals.user) throw Helpers.redirection('/admin/blog');
	const postId = Number(params.id);
	if (!params.id || isNaN(postId)) throw Helpers.redirection('/admin/blog');
	const post = await BlogDao.getPostById(postId);
	if (!post) throw Helpers.redirection('/admin/blog');

	return { post };
};
export const actions = {};
