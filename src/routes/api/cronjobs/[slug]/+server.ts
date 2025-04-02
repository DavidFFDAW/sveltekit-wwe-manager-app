import { Api } from '$lib/server/server.helpers.js';
import cronjobs from '$lib/server/dao/cronjobs.js';
import cronjobsUtils from '../cronjobs.utils.js';

export async function POST({ request, url }) {
	const headers = request.headers;
	const timestampStr = headers.get('x-timestamp');
	const signature = headers.get('x-signature');
	const cronSlug = headers.get('x-cron-slug');

	if (!timestampStr || !signature || !cronSlug) return Api.error('Missing or invalid headers', 400);
	const timestamp = parseInt(timestampStr, 10);
	if (!cronjobsUtils.isTimestampValid(timestamp)) return Api.error('Invalid timestamp', 403);
	if (!cronjobsUtils.isSignatureValid(cronSlug, timestamp, signature))
		return Api.error('Invalid signature', 403);

	try {
		const cronjob = await cronjobs.getBySlug(cronSlug);
		if (!cronjob) return Api.error('Cronjob not found', 404);
		if (!cronjob.active) return Api.error('Cronjob is disabled', 403);
		await cronjobsUtils.executeCronjob(cronSlug);

		return Api.success('Championship reigns updated', 200);
	} catch (error) {
		console.error(error);
		return Api.error('Error updating championship reigns', 500);
	}
}
