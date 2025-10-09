import { Helpers } from '$lib/server/server.helpers';
import { ImgurServerService } from '$lib/server/services/imgur.server.service.js';
import type { ImgurImage } from '../../../../../@types/Imgur.js';

// get user images
export async function DELETE({ request, locals, cookies, params }) {
	if (!locals.user)
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	const deleteHash = params.hash;
	if (!deleteHash)
		return Helpers.apiResponseMessage('No se ha podido obtener el hash de la imagen', 400);

	const accessToken = await ImgurServerService.getAndSaveAccessToken(cookies);
	if (accessToken instanceof Error)
		return Helpers.apiResponseMessage('No se ha podido obtener un token de acceso', 500);

	const deleteResponse = await ImgurServerService.deleteImage(deleteHash, accessToken);
	if (!deleteResponse.ok)
		return Helpers.apiResponseMessage('No se ha podido eliminar la imagen', 500);

	// console.log('deleteResponse', deleteResponse);

	return Helpers.apiResponseMessage('Imagen eliminada', 200);
}
