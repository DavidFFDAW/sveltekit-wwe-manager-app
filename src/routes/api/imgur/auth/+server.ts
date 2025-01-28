import { Helpers } from '$lib/server/server.helpers.js';
import { ImgurServerService } from '$lib/server/services/imgur.service.js';

export async function POST({ locals, cookies }) {
	if (!locals.user)
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	const storedToken = cookies.get('imgur_access_token');
	if (storedToken) return Helpers.apiResponse({ token: storedToken }, 200);

	const accessToken = await ImgurServerService.getAccessToken();
	if (!accessToken.ok || !accessToken.response.access_token)
		return Helpers.apiResponseMessage('No se ha podido obtener un token de acceso', 500);

	const expiration = new Date(Date.now() + 60 * 60 * 1000);
	cookies.set('imgur_access_token', accessToken.response.access_token, {
		httpOnly: true,
		secure: true,
		path: '/',
		expires: expiration,
		sameSite: 'strict'
	});

	return Helpers.apiResponse({ token: accessToken.response.access_token }, 200);
}
