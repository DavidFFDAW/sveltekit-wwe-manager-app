import { dev } from '$app/environment';
import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { Helpers } from '$lib/server/server.helpers';

const getCategoryWhereClause = (category: string) => {
	if (category === 'all') return {};
	return { category };
};

export const load = async ({ locals, url }) => {
	if (!locals.user && !dev) throw Helpers.redirection('/admin/dashboard');
	const params = url.searchParams;

	const searchCategory = params.get('category') || 'all';
	const searchTitle = params.get('search') || '';
	const publishStatus = params.get('status') || 'published';

	const blogRepo = new BlogRepository();
	const publishedFilter = blogRepo.isStatusAllowed(publishStatus) ? publishStatus : 'published';
	const page = parseInt(params.get('page') || '1', 10);
	const categoryWhereClause = getCategoryWhereClause(searchCategory);

	const paginatedDatas = await blogRepo.paginateN(
		page,
		{
			where: {
				title: { contains: searchTitle },
				status: publishedFilter,
				...categoryWhereClause
			},
			orderBy: { created_at: 'desc' }
		},
		20
	);

	return {
		categories: [
			{ name: 'Todos', value: 'all' },
			{ name: 'Resúmenes', value: 'summary' },
			{ name: 'Noticias', value: 'news' }
		],
		blogPagination: paginatedDatas,
		filters: {
			searchTitle,
			status: publishedFilter,
			category: params.get('category') || 'all'
		}
	};
};

export const actions = {
	changeStatus: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Permission denied');
		const datas = await request.formData();
		const updatingID = Helpers.getUpdateID(datas);
		if (!updatingID) return Helpers.error('ID not found');
		const status = datas.get('status');


		try {
			const repository = new BlogRepository();
			if (typeof status !== 'string' || !repository.isStatusAllowed(status)) {
				return Helpers.error('Invalid status value');
			}
			const post = await repository.getSingleById(updatingID);
			if (!post) return Helpers.error('Post not found');

			await repository.updateById(updatingID, { status });
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
