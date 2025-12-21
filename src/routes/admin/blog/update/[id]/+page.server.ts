import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ locals, params }) => {
	if (!locals.user) throw Helpers.redirection('/admin/blog');
	const postId = Number(params.id);
	if (!params.id || isNaN(postId)) throw Helpers.redirection('/admin/blog');

	const repository = new BlogRepository();
	const post = await repository.getSingleById(postId);
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

		try {
			const repository = new BlogRepository();
			const { error, message } = Helpers.checkRequiredFields(datas, repository.getRequiredFields());
			if (error) return Helpers.error(message, 400);

			const transformedDatas = repository.getTransformedObject(datas);
			const updatedPost = await repository.updateById(postId, transformedDatas);
			if (updatedPost.id) return Helpers.success('Post actualizado correctamente', 200);
		} catch (e: unknown) {
			if (e instanceof Error) return Helpers.error(`Error: ${e.message}`, 500);
		}
	}
};
