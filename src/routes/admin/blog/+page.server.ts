import { dev } from '$app/environment';
import { blog } from '$lib/server/dao/repositories/blog.repository.js';
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

	const publishedFilter = blog.isStatusAllowed(publishStatus) ? publishStatus : 'published';
	const page = parseInt(params.get('page') || '1', 10);
	const categoryWhereClause = getCategoryWhereClause(searchCategory);

	const paginatedDatas = await blog.paginateN(
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

			if (typeof status !== 'string' || !blog.isStatusAllowed(status)) {
				return Helpers.error('Invalid status value');
			}
			const post = await blog.getSingleById(updatingID);
			if (!post) return Helpers.error('Post not found');

			await blog.updateById(updatingID, { status });
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

		const singlePost = await blog.getSingleById(updatingID);
		if (!singlePost) return Helpers.error('No se encontró el post');

		try {
			await blog.delete({ id: updatingID });
			return Helpers.success('Post eliminado correctamente');
		} catch (error: any) {
			console.error(error);
			return Helpers.error('Error al eliminar el post');
		}
	}
};
