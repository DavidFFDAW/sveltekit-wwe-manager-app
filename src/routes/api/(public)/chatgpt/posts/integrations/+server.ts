import { BLOG_DRAFT_TOKEN } from '$env/static/private';
import { posts } from '$lib/server/dao/repositories/blog.repository.js';
import { Api, Helpers } from '$lib/server/server.helpers';

export async function POST({ request }) {
    try {
        const bearer = request.headers.get('Authorization');
        if (!bearer) return Api.error('Authorization header missing', 401);

        const token = bearer.split(' ')[1].trim();
        if (!token) return Api.error('Authorization token missing', 401);

        if (token !== BLOG_DRAFT_TOKEN)
            return Api.error('Invalid authorization token', 401);

        const data = await request.json();
        const fields = ['title', 'excerpt', 'content'];

        const missingFields = fields.filter(field => !data[field]);
        if (missingFields.length > 0)
            return Api.error(`Missing required fields: ${missingFields.join(', ')}`, 400);

        // At this point, all required fields are present and valid - so we create the post
        const createdPost = await posts.create({
            title: data.title as string,
            slug: Helpers.slugify(data.title as string),
            admin: {
                connect: { id: 1 } // Replace with actual admin ID to connect
            },
            exceptr: data.excerpt as string,
            content: data.content as string,
            created_at: new Date(),
            status: 'draft',
            category: 'Noticias',
            image: '',
            visible: false,
            provider: 'chatgpt',
            deletable: false,
        });

        if (!createdPost)
            return Api.error('Failed to create post', 500);

        const baseURL = new URL(request.url).origin;
        return Api.response({
            post_id: createdPost.id,
            message: 'Blog post has been created successfully',
            upsert_url: `${baseURL}/admin/blog/upsert?id=${createdPost.id}`,
            review_post_url: `${baseURL}/admin/blog/bulk/review`,
        }, 201);
    } catch (error) {
        return Api.error('An unexpected error occurred', 500);
    }
}
