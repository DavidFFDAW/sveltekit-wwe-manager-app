import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { Helpers } from '$lib/server/server.helpers';

export const load = async ({ locals, url }) => {
	if (!locals.user) throw Helpers.redirection('/admin/dashboard');
	const params = url.searchParams;

	const searchTitle = params.get('search') || '';
	const validStatuses = ['published', 'unpublished', 'draft'];
	const publishStatus = params.get('status') || 'published';
	const publishedFilter = validStatuses.includes(publishStatus) ? publishStatus : 'published';
	const page = parseInt(params.get('page') || '1', 10);

	const blogRepo = new BlogRepository();
	const paginatedDatas = await blogRepo.paginateN(
		page,
		{
			where: {
				title: { contains: searchTitle },
				status: publishedFilter
			},
			orderBy: { created_at: 'desc' }
		},
		20
	);

	return {
		blogPagination: paginatedDatas,
		filters: {
			searchTitle,
			publishedFilter
		}
	};
};

export const actions = {
	toggleVisibility: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Permission denied');
		const datas = await request.formData();
		const updatingID = Helpers.getUpdateID(datas);
		if (!updatingID) return Helpers.error('ID not found');

		const repository = new BlogRepository();
		const post = await repository.getSingleById(updatingID);
		if (!post) return Helpers.error('Post not found');

		try {
			await repository.updateById(updatingID, { visible: !post.visible });
			return Helpers.success(
				`Se ha cambiado el estado del post a: (${!post.visible ? 'publicado' : 'no publicado'})`
			);
		} catch (error: any) {
			console.error(error);
			return Helpers.error('Error al cambiar el estado de publicación del post');
		}
	},
	delete: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Permission denied');
		const datas = await request.formData();
		const updatingID = Helpers.getUpdateID(datas);
		if (!updatingID) return Helpers.error('No se encontró el ID');

		const postsRepository = new BlogRepository();
		const singlePost = await postsRepository.getSingleById(updatingID);
		if (!singlePost) return Helpers.error('No se encontró el post');

		try {
			await postsRepository.delete({ id: updatingID });
			return Helpers.success('Post eliminado correctamente');
		} catch (error: any) {
			console.error(error);
			return Helpers.error('Error al eliminar el post');
		}
	}
};
