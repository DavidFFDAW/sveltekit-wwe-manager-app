import cronjobs from '$lib/server/dao/cronjobs.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { executeCronBySlug } from '../../api/cronjobs/cronjobs.execute.js';

export const load = async () => {
	const jobs = await cronjobs.get();
	return { cronjobs: jobs };
};

export const actions = {
	executeCron: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Permission denied', 403);

		try {
			const formData = await request.formData();

			const slug = formData.get('slug') as string;
			if (!slug) return Helpers.error('Slug is required', 400);

			const cronjob = await cronjobs.getBySlug(slug);
			if (!cronjob) return Helpers.error('Cronjob not found', 404);

			await executeCronBySlug(slug, true);
			return Helpers.success('Cronjob executed successfully', 200);
		} catch (error) {
			console.error(error);
			return Helpers.error('Error executing cronjob', 500);
		}
	}
};
