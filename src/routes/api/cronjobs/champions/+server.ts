import { CRON_JOB_SECRET } from '$env/static/private';
import { reigns } from '$lib/server/dao/repositories';
import EmailService from '$lib/server/services/email.server.service';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	try {
		const authHeader = request.headers.get('Authorization');
		if (!request.headers.has('Authorization') || authHeader !== `Bearer ${CRON_JOB_SECRET}`)
			return new Response('Unauthorized', { status: 401 });

		const result = await reigns.executeCurrentReignsCronJob();
		if (result <= 0) console.log('No current reigns were updated.');

		await EmailService.sendAdminEmail(
			'Se han actualizado los reinados actuales',
			`Se han actualizado ${result} reinados actuales.`
		);

		return new Response(`Se han revisado los campeonatos. Se han actualizado ${result} reinados actuales.`, { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response('Internal Server Error', { status: 500 });
	}
};