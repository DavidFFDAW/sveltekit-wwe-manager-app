import { BlogDao } from '$lib/server/dao/blog.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

//this function updates the field `slug` of every post in the blog. If the post already has a slug, it will be kept.
export async function POST({ locals }) {
	if (!locals.user)
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);
	if (locals.user.role !== 'admin')
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	try {
		const posts = await BlogDao.getPosts();
		const updatedPosts = posts.map((post) => {
			post.slug = Helpers.slugify(post.title) as string;
			return post;
		});

		await Promise.all(updatedPosts.map((post) => BlogDao.updateSlug(post.id, post.slug as string)));
		return Helpers.apiResponseMessage('Se han actualizado los slugs para todos los posts', 200);
	} catch (error) {
		if (error instanceof Error) return Helpers.apiResponseMessage(error.message, 500);
		return Helpers.apiResponseMessage('Un error desconocido ha ocurrido', 500);
	}
}
