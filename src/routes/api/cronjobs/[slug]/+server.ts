import { Api } from '$lib/server/server.helpers.js';
import cronjobs from '$lib/server/dao/cronjobs.js';
import cronjobsUtils from '../cronjobs.utils.js';

export async function POST({ request, params }) {
	const headers = request.headers;
	try {
		const parameterSlug = params.slug;
		const { timestamp, signature, slug } = cronjobsUtils.getAuthHeaders(headers);
		if (parameterSlug !== slug) return Api.error('Invalid slug', 403);

		const parsedTimestamp = parseInt(timestamp, 10);
		if (!cronjobsUtils.isTimestampValid(parsedTimestamp))
			return Api.error('Invalid timestamp', 403);
		if (!cronjobsUtils.isSignatureValid(slug, parsedTimestamp, signature))
			return Api.error('Invalid signature', 403);

		const cronjob = await cronjobs.getBySlug(slug);
		if (!cronjob) return Api.error('Cronjob not found', 404);
		if (!cronjob.active) return Api.error('Cronjob is disabled', 403);
		await cronjobsUtils.executeCronjob(slug);

		return Api.success('Championship reigns updated', 200);
	} catch (error) {
		console.error(error);
		return Api.error('Error updating championship reigns', 500);
	}
}
