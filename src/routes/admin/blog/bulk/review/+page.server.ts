import { posts } from "$lib/server/dao/repositories";
import { Helpers } from "$lib/server/server.helpers.js";
import FormService from "$lib/services/form.service.js";

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
			created_at: 'desc'
		}
	});

	return { list };
}

export const actions = {
	update: async ({ request }) => {
		const data = await FormService.fromRequest(request);
		const postIds = data.getAll('post_ids[]').map(Number);
		const updatingPosts = postIds.map(id => ({
			id,
			date: data.get(`post[${id}][date]`),
			title: data.get(`post[${id}][title]`),
			published: data.getToggle(`post[${id}][published]`)
		}));

		console.log({ updatingPosts });
		return Helpers.error('Form submission failed');
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