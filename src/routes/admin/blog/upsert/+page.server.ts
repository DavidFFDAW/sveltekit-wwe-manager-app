import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { UsersRepository } from '$lib/server/dao/repositories/users.repository.js';
import type { Prisma } from '@prisma/client';

const getPost = async (id: number, repository: BlogRepository) => {
	if (!id || isNaN(id)) 
		return {} as Prisma.BlogPostUncheckedCreateInput;

	const post = await repository.getSingleById(id);
	if (!post)
		return {} as Prisma.BlogPostUncheckedCreateInput;

	return post;
}

export const load = async ({ url, locals }) => {
	const repository = new BlogRepository();
	const users = new UsersRepository();

	const id = Number(url.searchParams.get('id'));
	const post = await getPost(id, repository);
	const isUpdate = Boolean(post.id);

	const authors = await users.get({
		select: {
			id: true,
			name: true,
			email: true
		},
	});

	return {
		upsert: {
			post,
			authors,
			isUpdate,
			action: isUpdate ? 'update' : 'create',
			post_author: post.admin_id ? post.admin_id : 0,
		}
	};
}