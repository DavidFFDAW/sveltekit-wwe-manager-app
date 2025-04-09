import { Api } from '$lib/server/server.helpers.js';
import cronjobs from '$lib/server/dao/cronjobs.js';
import cronjobsUtils from '../cronjobs.utils.js';

export async function POST({ request }) {
	const headers = request.headers;
	try {
		const { timestamp, signature, slug } = cronjobsUtils.getAuthHeaders(headers);

		const parsedTimestamp = parseInt(timestamp, 10);
		if (!cronjobsUtils.isTimestampValid(parsedTimestamp))
			return Api.error('Invalid timestamp', 403);
		if (!cronjobsUtils.isSignatureValid(slug, parsedTimestamp, signature))
			return Api.error('Invalid signature', 403);

		const activeCrons = await cronjobs.getActiveCrons();
		if (!activeCrons || activeCrons.length <= 0)
			return Api.error('Could not find any active cronjob', 404);

		for (const job of activeCrons) {
			await cronjobsUtils.executeCronjob(job.slug, false);
		}
		await cronjobs.updateManyExecutionDate({
			active: true
		});

		return Api.success('All active cronjobs executed', 200);
	} catch (error) {
		console.error(error);
		return Api.error('Error updating championship reigns', 500);
	}
}
