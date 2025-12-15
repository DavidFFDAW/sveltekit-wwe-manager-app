import { BlogRepository } from '$lib/server/dao/repositories/blog.repository';
import { UsersDao } from '$lib/server/dao/users.dao.js';

export const load = async ({ locals }) => {
	const blogRepository = new BlogRepository();
	const blogPosts = await blogRepository.getPublishedPosts();
	const userDatas = locals.user ? await UsersDao.getUserById(locals.user.uuid) : null;
	return { posts: blogPosts, user: userDatas };
};
