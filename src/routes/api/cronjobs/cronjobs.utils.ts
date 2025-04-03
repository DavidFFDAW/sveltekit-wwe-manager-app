import crypto from 'crypto';
import { CRON_JOB_SECRET } from '$env/static/private';
import { executeCronBySlug } from './cronjobs.execute';

export const cronjobsUtils = {
	isTimestampValid: (timestamp: number, tolerance = 300): boolean => {
		const now = Math.floor(Date.now() / 1000);
		return Math.abs(now - timestamp) <= tolerance;
	},

	isSignatureValid: (slug: string, timestamp: number, signature: string): boolean => {
		const payload = `${slug}:${timestamp}`;
		const expected = crypto.createHmac('sha256', CRON_JOB_SECRET).update(payload).digest('hex');

		return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
	},
	getAuthHeaders: (headers: Headers) => {
		const timestamp = headers.get('x-timestamp');
		const signature = headers.get('x-signature');
		const slug = headers.get('x-cron-slug');
		const bearer = headers.get('Authorization')?.split(' ')[1];
		if (!timestamp || !signature || !slug) {
			throw new Error('Missing or invalid headers');
		}

		return { timestamp, signature, slug, bearer };
	},
	executeCronjob: executeCronBySlug
};

export default cronjobsUtils;
