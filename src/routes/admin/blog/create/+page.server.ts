import { blog } from '$lib/server/dao/repositories/blog.repository';
import { Helpers } from '$lib/server/server.helpers.js';

export const actions = {
    default: async ({ request, locals, fetch }) => {
        if (!Helpers.hasPermission(locals)) return Helpers.error('No tienes permisos para hacer esto.');
        const datas = await request.formData();

        if (!locals.user?.uuid) return Helpers.error('No se pudo obtener el usuario', 500);
        datas.set('author', locals.user.uuid.toString());

        try {
            const { error, message } = Helpers.checkRequiredFields(datas, blog.getRequiredFields());
            if (error) return Helpers.error(message, 400);

            const createdPost = await blog.create(blog.getTransformedObject(datas));
            if (!createdPost) return Helpers.error('No se pudo crear el post', 500);

            if (createdPost.status === 'published' && createdPost.visible) {
                await fetch('/api/push/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: 'Nuevo post: ' + createdPost.title,
                        body: 'Se ha creado un nuevo post en el blog. ¡No te lo pierdas!',
                        url: `/blog/${createdPost.slug}`,
                        image: createdPost.image
                    })
                });
            }

            return Helpers.success('Post creado correctamente', 201);
        } catch (e: unknown) {
            if (e instanceof Error) return Helpers.error(`Error: ${e.message}`, 500);
        }
    }
};
