import { BlogDao } from '$lib/server/dao/blog.dao.js';

export const load = async ({ params }) => {
	const { slug } = params;
	const post = await BlogDao.getPostBySlug(slug);
	return { post };
};

export const actions = {};
