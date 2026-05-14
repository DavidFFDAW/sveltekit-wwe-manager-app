import { BlogRepository } from '$lib/server/dao/repositories/blog.repository';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ params }) => {
	const { slug } = params;

	const repository = new BlogRepository();
	const post = await repository.getReadablePostBySlug(slug);
	if (!post) return Helpers.redirection('/blog');
	await repository.updateById(post.id, { views: post.views + 1 });

	const related = await repository.getRelatedPosts(post.id, post.category, 2);

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
