import { BlogAdapter } from '$lib/server/adapters/blog.adapter.js';
import { BlogDao } from '$lib/server/dao/blog.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('No tienes permisos para hacer esto.');
		const datas = await request.formData();
		console.log(Object.fromEntries(datas));

		// add user from locals ↑
		const { error, message } = Helpers.checkRequiredFields(datas, BlogAdapter.required);
		if (error) return Helpers.error(message, 400);

		try {
			const createdPost = await BlogDao.createBlogPost(BlogAdapter.getTransformedObject(datas));
			if (createdPost.id) return Helpers.success('Post creado correctamente', 201);
		} catch (e: unknown) {
			if (e instanceof Error) return Helpers.error(`Error: ${e.message}`, 500);
		}
	}
};
