import { posts } from "$lib/server/dao/repositories";
import { Helpers } from "$lib/server/server.helpers.js";
import FormService from "$lib/services/form.service.js";
import type { Prisma } from "@prisma/client";

export const load = async () => {
	const list = await posts.get({
		select: {
			id: true,
			title: true,
			status: true,
			provider: true,
			created_at: true,
			category: true,
			image: true,
		},
		where: {
			status: 'draft',
			provider: 'chatgpt',
		},
		orderBy: {
			created_at: 'asc'
		}
	});

	return { list };
}

export const actions = {
	update: async ({ request }) => {
		try {
			const data = await FormService.fromRequest(request);
			const postIds = data.getAll('post_ids[]').map(Number);
			const updatingPosts: { id: number, update: Prisma.BlogPostUpdateInput }[] = postIds.map(id => {
				return {
					id,
					update: {
						title: data.get(`post[${id}][title]`),
						created_at: new Date(data.get(`post[${id}][date]`) + 'T00:00:00'),
						status: data.getToggle(`post[${id}][published]`) ? 'published' : 'draft',
					}
				};
			});

			await Promise.all(updatingPosts.map(post => posts.updateById(post.id, post.update)));
			return Helpers.success('Form submission successful');
		} catch (error) {
			console.error(error);
			return Helpers.error('Form submission failed');
		}
	},
	delete: async ({ request }) => {
		const data = await FormService.fromRequest(request);
		const id = data.getNumber('delete');
		if (!id || id <= 0) return Helpers.error('Invalid post ID');

		try {
			await posts.delete({
				id: id
			});
			return Helpers.success('Se ha borrado correctamente el post');
		} catch (error) {
			console.error(error);
			return Helpers.error('Failed to delete post');
		}
	}
}