import cronjobs from '$lib/server/dao/cronjobs';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ locals, params }) => {
	const { slug } = params;
	if (!slug) return Helpers.redirection('/admin/cronjobs', 302);

	return {
		cronjob: await cronjobs.getBySlug(slug)
	};
};

export const actions = {
	default: async ({ request, locals, url }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para hacer eso', 403);

		const data = await request.formData();
		const { error, message } = Helpers.checkRequiredFields(data, ['name', 'slug']);
		if (error) return Helpers.error(message, 400);

		const slug = Helpers.slugify(data.get('slug') as string);
		const savingUrl = `${url.origin}/api/cronjobs/${slug}`;
		const updateId = Helpers.getUpdateID(data);

		try {
			const updatedCronJob = await cronjobs.update(updateId, {
				name: data.get('name') as string,
				slug: slug,
				url: savingUrl,
				description: data.get('description') as string,
				active: Helpers.getToggleInput(data, 'active'),
				frequency: data.get('frequency') as string
			});

			if (!updatedCronJob) return Helpers.error('Error creando el cronjob', 500);
			return Helpers.success('Cronjob creado', 200);
		} catch (error) {
			console.error(error);
			return Helpers.error('Error creando el cronjob', 500);
		}
	}
};
