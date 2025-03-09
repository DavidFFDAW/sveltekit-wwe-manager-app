import { BlogDao } from '$lib/server/dao/blog.dao';
import { UsersDao } from '$lib/server/dao/users.dao.js';

export const load = async ({ locals }) => {
	const blogPosts = await BlogDao.getPublishedBlogPosts();
	const userDatas = locals.user ? await UsersDao.getUserById(locals.user.uuid) : null;
	return { posts: blogPosts, user: userDatas };
};
