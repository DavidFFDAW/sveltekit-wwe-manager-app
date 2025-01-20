import { Helpers } from '$lib/server/server.helpers';

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const credentials = {
			email: form.get('email') as string,
			password: form.get('password') as string
		};

		console.log(credentials);

		return Helpers.error('Not implemented');
	}
};
