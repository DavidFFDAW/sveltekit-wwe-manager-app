import { Helpers } from '$lib/server/server.helpers.js';
import { ImgurServerService } from '$lib/server/services/imgur.server.service.js';

export async function POST({ locals, cookies }) {
	if (!locals.user)
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	const storedToken = cookies.get('imgur_access_token');
	if (storedToken) return Helpers.apiResponse({ token: storedToken }, 200);

	const accessToken = await ImgurServerService.getAndSaveAccessToken(cookies);
	if (!accessToken)
		return Helpers.apiResponseMessage('No se ha podido obtener un token de acceso', 500);

	return Helpers.apiResponse({ token: accessToken }, 200);
}
