import { Helpers } from '$lib/server/server.helpers';
import { ImgurServerService } from '$lib/server/services/imgur.server.service.js';
import type { ImgurImage } from '../../../../@types/Imgur.js';

export async function POST({ request, locals, cookies }) {
	if (!locals.user)
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	const datas = await request.formData();
	if (!datas.has('imgur-image'))
		return Helpers.apiResponseMessage('No se ha podido obtener la imagen', 400);

	const file = datas.get('imgur-image') as File;
	if (!file) return Helpers.apiResponseMessage('No se ha podido obtener la imagen', 400);

	const accessToken = await ImgurServerService.getAndSaveAccessToken(cookies);
	if (accessToken instanceof Error)
		return Helpers.apiResponseMessage('No se ha podido obtener un token de acceso', 500);

	const uploadResponse = await ImgurServerService.uploadImage(file, accessToken);
	if (!uploadResponse.ok) return Helpers.apiResponseMessage('No se ha podido subir la imagen', 500);

	return Helpers.apiResponse({
		uploaded_image: uploadResponse.response.data as ImgurImage
	});
}
