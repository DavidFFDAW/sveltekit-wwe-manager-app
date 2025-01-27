import { BlogDao } from '$lib/server/dao/blog.dao';

export const load = async () => {
    const blogPosts = await BlogDao.getPublishedBlogPosts();
    return { posts: blogPosts };
};
