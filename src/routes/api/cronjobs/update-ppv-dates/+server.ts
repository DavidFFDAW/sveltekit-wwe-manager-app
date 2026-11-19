import { CRON_JOB_SECRET } from '$env/static/private';
import { ppv } from '$lib/server/dao/repositories/ppv.repository';
import { Api } from '$lib/server/server.helpers';

export const GET = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');
	if (!request.headers.has('Authorization') || authHeader !== `Bearer ${CRON_JOB_SECRET}`)
		return new Response('Unauthorized', { status: 401 });

	try {
		const updated = await ppv.updatePastPpvDates();
		return Api.success(`Fechas de PPV actualizadas: ${updated}`);
	} catch (error) {
		console.error(error);
		return Api.error('Error al actualizar las fechas de los PPV', 500);
	}
};
