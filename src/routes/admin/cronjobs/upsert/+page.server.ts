import prisma from '$lib/server/prisma';
import { Helpers } from '$lib/server/server.helpers.js';

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para hacer eso', 403);

		const data = await request.formData();
		const { error, message } = Helpers.checkRequiredFields(data, ['name', 'url']);
		if (error) return Helpers.error(message, 400);

		try {
			const createdCronJob = await prisma.cronjobs.create({
				data: {
					name: data.get('name') as string,
					url: data.get('url') as string,
					description: data.get('description') as string,
					active: Helpers.getToggleInput(data, 'active'),
					frequency: data.get('frequency') as string
				}
			});
			if (!createdCronJob) return Helpers.error('Error creando el cronjob', 500);
			return Helpers.success('Cronjob creado', 200);
		} catch (error) {
			console.error(error);
			return Helpers.error('Error creando el cronjob', 500);
		}
	}
};
