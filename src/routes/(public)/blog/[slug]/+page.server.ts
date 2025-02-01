import { BlogDao } from '$lib/server/dao/blog.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ params }) => {
	const { slug } = params;
	const post = await BlogDao.getReadablePostBySlug(slug);
	if (!post) return Helpers.redirection('/blog');

	return { post };
};

export const actions = {};
