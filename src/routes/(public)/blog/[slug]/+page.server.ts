import { blog } from '$lib/server/dao/repositories/blog.repository';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ params }) => {
	const { slug } = params;

	const post = await blog.getReadablePostBySlug(slug);
	if (!post) return Helpers.redirection('/blog');
	await blog.updateById(post.id, { views: post.views + 1 });

	const related = await blog.getRelatedPosts(post.id, post.category, 2);

	return {
		post,
		related_posts: related,
		metas: {
			title: post.title,
			description: post.exceptr,
			image: post.image
		}
	};
};

export const actions = {};
