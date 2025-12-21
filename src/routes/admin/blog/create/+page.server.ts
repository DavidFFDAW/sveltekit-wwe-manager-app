import { BlogAdapter } from '$lib/server/adapters/blog.adapter.js';
import { BlogRepository } from '$lib/server/dao/repositories/blog.repository';
import { Helpers } from '$lib/server/server.helpers.js';

export const actions = {
	default: async ({ request, locals, fetch }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('No tienes permisos para hacer esto.');
		const datas = await request.formData();

		if (!locals.user?.uuid) return Helpers.error('No se pudo obtener el usuario', 500);
		datas.set('author', locals.user.uuid.toString());

		const { error, message } = Helpers.checkRequiredFields(datas, BlogAdapter.required);
		if (error) return Helpers.error(message, 400);

		try {
			const repository = new BlogRepository();
			const { error, message } = Helpers.checkRequiredFields(datas, repository.getRequiredFields());
			if (error) return Helpers.error(message, 400);

			const createdPost = await repository.create(repository.getTransformedObject(datas));
			if (!createdPost) return Helpers.error('No se pudo crear el post', 500);

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

			return Helpers.success('Post creado correctamente', 201);
		} catch (e: unknown) {
			if (e instanceof Error) return Helpers.error(`Error: ${e.message}`, 500);
		}
	}
};
