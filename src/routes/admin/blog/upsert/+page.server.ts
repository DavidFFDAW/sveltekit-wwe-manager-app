import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { UsersRepository } from '$lib/server/dao/repositories/users.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import type { Prisma } from '@prisma/client';

const getPost = async (id: number, repository: BlogRepository) => {
	if (!id || isNaN(id)) return {} as Prisma.BlogPostUncheckedCreateInput;

	const post = await repository.getSingleById(id);
	if (!post) return {} as Prisma.BlogPostUncheckedCreateInput;

	return post;
};

export const load = async ({ url }) => {
	const repository = new BlogRepository();
	const users = new UsersRepository();

	const id = Number(url.searchParams.get('id'));
	const post = await getPost(id, repository);
	const isUpdate = Boolean(post.id);
	const averageViews = await repository.getPostAverageViews();
	const currentViewsPercentage = isUpdate && post.views ? (post.views / averageViews) * 100 : 0;

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

		const post: Prisma.BlogPostCreateInput = {
			title: datas.get('title') as string,
			slug: datas.get('slug') as string,
			exceptr: datas.get('excerpt') as string,
			content: datas.get('content') as string,
			views: Number(datas.get('views') || 0),
			visible: datas.get('visible') === 'visible',
			deletable: datas.get('autodelete') === 'deletable',
			category: datas.get('category') as string,
			status: datas.get('status') as string,
			image: datas.get('image') as string,
			admin: { connect: { id: Number(datas.get('post_author')) } }
		};
		console.log({ post, updateId, autodelete: datas.get('autodelete') });

		return Helpers.error('No se ha especificado una acción válida', 400);
	}
};
