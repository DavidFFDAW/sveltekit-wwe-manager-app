import { Helpers } from '$lib/server/server.helpers';
import { ImgurServerService } from '$lib/server/services/imgur.server.service.js';
import type { ImgurImage } from '../../../../@types/Imgur.js';

// get user images
export async function GET({ locals, cookies }) {
	if (!locals.user)
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	const accessToken = await ImgurServerService.getAndSaveAccessToken(cookies);
	if (accessToken instanceof Error)
		return Helpers.apiResponseMessage('No se ha podido obtener un token de acceso', 500);

	const imagesResponse = await ImgurServerService.getUserImages(accessToken);
	if (!imagesResponse.ok)
		return Helpers.apiResponseMessage('No se han podido obtener las imágenes del usuario', 500);

	return Helpers.apiResponse({
		images: imagesResponse.response.data as ImgurImage[]
	});
}
