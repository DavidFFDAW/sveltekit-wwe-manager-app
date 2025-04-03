import cronjobs from '$lib/server/dao/cronjobs';
import { Helpers } from '$lib/server/server.helpers.js';

export const actions = {
	default: async ({ request, locals, url }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para hacer eso', 403);

		const data = await request.formData();
		const { error, message } = Helpers.checkRequiredFields(data, ['name', 'slug']);
		if (error) return Helpers.error(message, 400);
		const slug = Helpers.slugify(data.get('slug') as string);

		try {
			const createdCronJob = await cronjobs.create({
				name: data.get('name') as string,
				slug: slug,
				endpoint: `/api/cronjobs/${slug}`,
				host: url.origin,
				description: data.get('description') as string,
				active: Helpers.getToggleInput(data, 'active'),
				frequency: data.get('frequency') as string
			});
			if (!createdCronJob) return Helpers.error('Error creando el cronjob', 500);
			return Helpers.success('Cronjob creado', 200);
		} catch (error) {
			console.error(error);
			return Helpers.error('Error creando el cronjob', 500);
		}
	}
};
