import { Helpers } from '$lib/server/server.helpers';

export async function PUT({ request, locals }) {
	if (Helpers.hasPermission(locals) === false)
		return Helpers.api.error('No tienes permisos para realizar esta acción', 403);

	const data = await request.formData();
	console.log({
		type: data.get('type'),
		provider: data.get('provider'),
		image: data.get('image')
	});

	return Helpers.api.error('Not implemented', 501);
}
