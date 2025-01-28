import { Helpers } from '$lib/server/server.helpers';
import { ImgurServerService } from '$lib/server/services/imgur.server.service';

export async function POST({ locals, cookies }) {
	if (!locals.user)
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	const accessToken = await ImgurServerService.getAndSaveAccessToken(cookies);
	if (accessToken instanceof Error)
		return Helpers.apiResponseMessage('No se ha podido obtener un token de acceso', 500);

	return Helpers.apiResponse({ token: accessToken }, 200);
}
