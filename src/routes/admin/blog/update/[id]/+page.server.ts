import { BlogAdapter } from '$lib/server/adapters/blog.adapter';
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
export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('No tienes permisos para hacer esto.');
		const datas = await request.formData();
		const postId = Number(datas.get('_update_id'));
		if (!postId || isNaN(postId)) return Helpers.error('No se pudo obtener el post', 400);

		if (!locals.user?.uuid) return Helpers.error('No se pudo obtener el usuario', 500);
		datas.set('author', locals.user.uuid.toString());
		datas.set('visible', datas.get('is_published') === 'published' ? 'true' : 'false');
		datas.set('deletable', datas.get('auto_delete') === 'active' ? 'true' : 'false');

		const { error, message } = Helpers.checkRequiredFields(datas, BlogAdapter.required);
		if (error) return Helpers.error(message, 400);

		try {
			const updatedPost = await BlogDao.updateBlogPost(
				postId,
				BlogAdapter.getTransformedObject(datas)
			);
			if (updatedPost.id) return Helpers.success('Post actualizado correctamente', 200);
		} catch (e: unknown) {
			if (e instanceof Error) return Helpers.error(`Error: ${e.message}`, 500);
		}
	}
};
