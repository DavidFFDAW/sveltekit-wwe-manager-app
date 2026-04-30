import { BlogRepository } from '$lib/server/dao/repositories/blog.repository';
import { UsersRepository } from '$lib/server/dao/repositories/users.repository.js';

const getUserRole = (locals: App.Locals) => {
	if (!locals.user) return 'guest';
	return locals.user.role;
};

export const load = async ({ locals }) => {
	const role = getUserRole(locals);
	const isAdminRole = ['admin', 'superadmin'].includes(role);
	const statuses = isAdminRole ? ['published', 'private'] : ['published'];

	const blog = new BlogRepository();
	const users = new UsersRepository();
	const blogPosts = await blog.getPublishedPostsByStatuses(statuses);
	const userDatas = locals.user ? await users.getSingleById(locals.user.uuid) : null;

	return { posts: blogPosts, user: userDatas };
};
