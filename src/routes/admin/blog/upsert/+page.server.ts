import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { UsersRepository } from '$lib/server/dao/repositories/users.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import IaService from '../../../api/blog/generate/services/ia.service';
import type { Prisma } from '@prisma/client';

type BlogUpsertData = Prisma.BlogPostCreateInput | Prisma.BlogPostUpdateInput;

const getPost = async (id: number, repository: BlogRepository) => {
	if (!id || isNaN(id)) return {} as Prisma.BlogPostUncheckedCreateInput;

	const post = await repository.getSingleById(id);
	if (!post) return {} as Prisma.BlogPostUncheckedCreateInput;

	return post;
};

export const load = async ({ url, locals }) => {
	const repository = new BlogRepository();
	const users = new UsersRepository();

	const id = Number(url.searchParams.get('id'));
	const post = await getPost(id, repository);
	const isUpdate = Boolean(post.id);
	const averageViews = await repository.getPostAverageViews();
	const currentViewsPercentage = isUpdate && post.views ? (post.views / averageViews) * 100 : 0;

	const localUserId = locals.user?.uuid || 1;
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
			iaModels: IaService.getAvailableModels(),
			post_author: post.admin_id ? post.admin_id : localUserId,
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

		const author = Number(datas.get('author'));
		if (author && isNaN(author)) return Helpers.error('ID de autor no válido', 400);

		const formAction = datas.get('action');
		const action = Boolean(id) && formAction === 'update' ? 'update' : 'create';
		const isUpdate = action === 'update';

		const updateId = Helpers.getUpdateID(datas);
		if (isUpdate && (!updateId || isNaN(updateId))) return Helpers.error('ID de actualización no válido', 400);
		if (isUpdate && updateId !== id)
			return Helpers.error('ID de actualización no coincide con el ID del post', 400);

		const publishedDate = new Date(datas.get('publish_date') as string);

		try {
			const repository = new BlogRepository();
			// const existingPost = isUpdate ? await repository.getSingleById(updateId) : false;

			const post: BlogUpsertData = {
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
				admin: { connect: { id: author } },
				// published_at: publishedDate
				created_at: publishedDate
			};

			if (!isUpdate) {
				const created = await repository.create(post as Prisma.BlogPostCreateInput);
				return Helpers.responseRedirect(`/admin/blog/upsert?id=${created.id}`);
			}

			if (isUpdate) await repository.updateById(updateId, post);
			return Helpers.success('Post guardado exitosamente');

		} catch (error: unknown) {
			console.error('Error al guardar el post:', error);
			return Helpers.error('Error al guardar el post', 500);
		}
	}
};
