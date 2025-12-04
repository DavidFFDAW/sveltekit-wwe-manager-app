import { BlogDao } from '$lib/server/dao/blog.dao';
import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { Helpers } from '$lib/server/server.helpers';

export const load = async ({ locals, url }) => {
	if (!locals.user) throw Helpers.redirection('/admin/dashboard');
	const params = url.searchParams;

	const searchTitle = params.get('search') || '';
	const publishedFilter = params.get('published') || 'published';
	const page = parseInt(params.get('page') || '1', 10);

	const blogRepo = new BlogRepository();
	const paginatedDatas = await blogRepo.paginateN(
		page,
		{
			where: {
				title: { contains: searchTitle },
				visible: publishedFilter === 'published'
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

		console.log('aaaaaaaaaaaaaaaaaa');
		for (const pair of datas.entries()) {
			console.log(`${pair[0]}: ${pair[1]}`);
		}

		const updatingID = Helpers.getUpdateID(datas);
		if (!updatingID) return Helpers.error('ID not found');

		const post = await BlogDao.getPostById(updatingID);
		if (!post) return Helpers.error('Post not found');

		await BlogDao.updatePublish(updatingID, !post.visible);
		return Helpers.success('Post updated');
	}
};
