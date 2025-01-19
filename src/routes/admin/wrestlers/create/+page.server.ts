import { Helpers } from '$lib/server/server.helpers';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const wrestler = Object.fromEntries(formData);
		console.log({
			wrestler,
			tests: formData.getAll('test')
		});

		return Helpers.error('Error al intentar crear recurso Wrestler', 500);

		return {
			status: 303,
			message: 'Wrestler created'
		};
	}
};
