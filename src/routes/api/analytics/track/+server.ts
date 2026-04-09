import { dev } from '$app/environment';
import { AnalyticsRepository } from '$lib/server/dao/repositories/analytics.respository';
import { Helpers } from '$lib/server/server.helpers';
import { AnalyticsHelpers } from './analytics.helper';

const getClientIpAddress = (request: Request) => {
    return request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'Unknown';
};
const isSameOrigin = (request: Request, siteOrigin: string): boolean => {
	const origin = request.headers.get('origin')
	const referer = request.headers.get('referer')

	if (origin !== null) return origin === siteOrigin
	if (referer !== null) return referer.startsWith(siteOrigin)

	return false
}

export async function POST({ request, url }) {
	try {
		if (dev) return Helpers.api.error('No se registrarán analíticas en desarrollo', 403);
		
		if (!isSameOrigin(request, url.origin))
			return Helpers.api.error('Origen no permitido', 403);
		
		const body = await request.json();
		const userAgent = request.headers.get('user-agent') || 'Unknown';
		const refererHeader = request.headers.get('referer') || '';
		const ip = getClientIpAddress(request);
		// const country = request.headers.get('x-country') || '';

		const event = String(body.event || 'pageview');
		const path = String(body.url || '/');

		const repository = new AnalyticsRepository();
		const analyticsData = await AnalyticsHelpers.getAnalyticsData(userAgent, ip);

		await repository.create({
			event,
			page: path,
			referer: refererHeader,
			...analyticsData
		});
		
		return Helpers.api.success('Evento de analítica registrado correctamente');
	} catch (error) {
		console.error('Error tracking analytics:', error);
		return Helpers.api.error('Error al procesar los datos de analítica', 500);
	}
}
