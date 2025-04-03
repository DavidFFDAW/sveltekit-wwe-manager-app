import cronjobs from '$lib/server/dao/cronjobs.js';
import { Api, Helpers } from '$lib/server/server.helpers.js';

export async function POST({ url, locals }) {
	// update every cron host url
	if (!Helpers.hasPermission(locals)) return Api.error('No tienes permisos para hacer eso', 403);

	try {
		await cronjobs.updateMany({
			host: url.origin
		});
		return Api.success('Cronjobs updated', 200);
	} catch (error) {
		console.error(error);
		return Api.error('Error updating cronjobs', 500);
	}
}
