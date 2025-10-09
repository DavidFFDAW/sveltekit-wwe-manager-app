import { BlogDao } from '$lib/server/dao/blog.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ params }) => {
	const { slug } = params;
	const post = await BlogDao.getReadablePostBySlug(slug);
	if (!post) return Helpers.redirection('/blog');
	await BlogDao.updatePostViews(post.id);
	return {
		post,
		metas: {
			title: post.title,
			description: post.exceptr,
			image: post.image
		}
	};
};

export const actions = {};
