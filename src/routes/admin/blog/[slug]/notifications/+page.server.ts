import { MAIL_API_ADMIN, MAIL_API_KEY, MAIL_API_URL } from '$env/static/private';
import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { UsersRepository } from '$lib/server/dao/repositories/users.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import EmailService from '$lib/server/services/email.server.service.js';
import { redirect } from '@sveltejs/kit';

const postsRepository = new BlogRepository();
const usersRepository = new UsersRepository();
const today = new Date();

export async function load({ params }) {
    const { slug } = params;
    if (!slug) return redirect(302, '/admin/blog');
    if (isNaN(Number(slug))) return redirect(302, '/admin/blog');

    const post = await postsRepository.getSingleById(Number(slug));
    if (!post) return redirect(302, '/admin/blog');

    const subscribers = await usersRepository.getEmailSubscribedUsers();

    return {
        slug,
        post,
        subscribers,
    };
}

export const actions = {
    default: async ({ params, url }) => {
        const { slug } = params;
        if (!slug) return redirect(302, '/admin/blog');
        if (isNaN(Number(slug))) return redirect(302, '/admin/blog');

        // open the file in the /static directory
        const fileContent = EmailService.getTemplateContent('blog');
        if (!fileContent || fileContent.length === 0) {
            console.error('Email template not found or empty');
            return Helpers.error('Plantilla de correo electrónico no encontrada o vacía');
        }

        const post = await postsRepository.getSingleById(Number(slug));
        if (!post) return redirect(302, '/admin/blog');

        const keys = {
            '{{BRAND_NAME}}': 'WWE 2K Manager',
            '{{YEAR}}': today.getFullYear().toString(),
            '{{POST_TITLE}}': post.title,
            '{{POST_EXCERPT}}': post.exceptr,
            '{{POST_URL}}': `${url.origin}/blog/${post.slug}`,
            '{{POST_DATE}}': post.created_at ? post.created_at.toDateString() : '',
            '{{POST_IMAGE_URL}}': post.image,
            '{{SHOW_NAME}}': post.title,
            '{{AUTHOR_NAME}}': post.category,
            '{{POST_TAGS}}': post.category,
            '{{BLOG_URL}}': `${url.origin}/blog`,
            '{{PREFERENCES_URL}}': `${url.origin}/user/preferences`,
            '{{UNSUBSCRIBE_URL}}': `${url.origin}/user/unsubscribe`,
        };

        const response = await EmailService.sendEmailTemplate(
            MAIL_API_ADMIN,
            `Vista previa de la notificación del blog: ${post.title}`,
            fileContent,
            keys,
        );

        if (!response.ok) {
            console.error('Error sending preview email:', response.status, response.response);
            return Helpers.error('Error al enviar la vista previa de la notificación');
        }
        return Helpers.success('Vista previa de la notificación enviada al administrador correctamente');
    },
};
