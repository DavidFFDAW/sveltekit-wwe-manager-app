import { BlogDao } from '$lib/server/dao/blog.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

//this function updates the field `slug` of every post in the blog. If the post already has a slug, it will be kept.
export async function POST({ locals }) {
    if (!locals.user) return Helpers.apiResponse('Unauthorized', 401);
    if (locals.user.role !== 'admin') return Helpers.apiResponse('Unauthorized', 403);

    try {
        const posts = await BlogDao.getPosts();
        const postWithoutSlug = posts.filter(post => !post.slug);
        const updatedPosts = postWithoutSlug.map(post => {
            post.slug = Helpers.slugify(post.title);
            return post;
        });

        await Promise.all(updatedPosts.map(post => BlogDao.updateSlug(post.id, post.slug)));
        return Helpers.apiResponse('Posts updated successfully');
    } catch (error) {
        if (error instanceof Error) return Helpers.apiResponse(error.message, 500);
        return Helpers.apiResponse('An error occurred', 500);
    }
}
