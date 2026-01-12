import { Helpers } from '$lib/server/server.helpers';
import { ImageService } from '$lib/server/services/images/image.service.js';

export async function GET({ locals, url, cookies }) {
	if (!Helpers.hasPermission(locals))
		return Helpers.api.error('No tienes permisos para realizar esta acción', 403);

	try {
		const provider = url.searchParams.get('provider') || 'gallery';
		console.log('Fetching images from provider:', provider);

		const galleryDatas = {
			locals,
			cookies,
			searchParams: url.searchParams
		};
		const images = await ImageService.getImages(galleryDatas, provider);
		if (!images) return Helpers.api.error('Error al obtener las imágenes', 500);

		return Helpers.api.json({ images });
	} catch (error) {
		console.error('Error in GET /api/images:', error);
		return Helpers.api.error('Error interno del servidor', 500);
	}
}
