import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { UsersRepository } from '$lib/server/dao/repositories/users.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { ImageService } from '$lib/server/services/images/image.service.js';
import type { Prisma } from '@prisma/client';

const getPost = async (id: number, repository: BlogRepository) => {
	if (!id || isNaN(id)) return {} as Prisma.BlogPostUncheckedCreateInput;

	const post = await repository.getSingleById(id);
	if (!post) return {} as Prisma.BlogPostUncheckedCreateInput;

	return post;
};

export const load = async ({ url, cookies, locals }) => {
	const repository = new BlogRepository();
	const users = new UsersRepository();

	const id = Number(url.searchParams.get('id'));
	const post = await getPost(id, repository);
	const isUpdate = Boolean(post.id);
	const averageViews = await repository.getPostAverageViews();
	const currentViewsPercentage = isUpdate && post.views ? (post.views / averageViews) * 100 : 0;
	const imgurImages = await ImageService.getImages({
		cookies,
		locals,
		searchParams: url.searchParams
	}, 'imgur');

	const authors = await users.get({
		select: {
			id: true,
			name: true,
			email: true
		}
	});

	return {
		upsert: {
			post,
			authors,
			isUpdate,
			images: { list: imgurImages, provider: 'imgur' },
			averageViews: averageViews.toFixed(2),
			action: isUpdate ? 'update' : 'create',
			post_author: post.admin_id ? post.admin_id : 0,
			view_percentage: currentViewsPercentage.toFixed(2),
			view_performance:
				currentViewsPercentage > 75
					? '🔥 Trending'
					: currentViewsPercentage > 50
						? '👍 Normal'
						: '📉 Low'
		}
	};
};

export const actions = {
	default: async ({ request, url }) => {
		const datas = await request.formData();
		const id = Number(url.searchParams.get('id'));
		if (!id || isNaN(id)) return Helpers.error('ID de post no válido', 400);

		const updateId = Helpers.getUpdateID(datas);
		if (!updateId || isNaN(updateId)) return Helpers.error('ID de actualización no válido', 400);
		if (updateId !== id)
			return Helpers.error('ID de actualización no coincide con el ID del post', 400);

		const formAction = datas.get('action');
		const action = Boolean(id) && formAction === 'update' ? 'update' : 'create';

		try {
			const repository = new BlogRepository();
			const post: Prisma.BlogPostCreateInput = {
				title: datas.get('title') as string,
				slug: datas.get('slug') as string,
				exceptr: datas.get('excerpt') as string,
				content: datas.get('content') as string,
				views: Number(datas.get('views') || 0),
				visible: datas.get('visible') === 'visible',
				deletable: datas.get('autodelete') === 'deletable',
				category: datas.get('category') as string,
				status: repository.getPostStatus(datas.get('status') as string),
				image: (datas.get('image') as string) || '',
				admin: { connect: { id: Number(datas.get('post_author')) } }
			};

			console.log({ post, updateId, autodelete: datas.get('autodelete') });
			if (action === 'update') await repository.updateById(updateId, post);
			if (action === 'create') await repository.create(post);
			return Helpers.success('Post guardado exitosamente');
		} catch (error) {
			console.error('Error al guardar el post:', error);
			return Helpers.error('Error al guardar el post', 500);
		}
	}
};
