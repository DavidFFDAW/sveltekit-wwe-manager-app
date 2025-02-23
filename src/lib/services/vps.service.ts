import { HttpService } from './http.service';

const error = (message: string) => {
	return { error: true, message, data: null };
};

export async function uploadVpsImage(image: File, dataUrl: string) {
	if (!image) return error('No hay imagen para subir');
	if (image.size / 1024 > 120) return error('Archivo demasiado grande para la subida');

	const formData = new FormData();
	formData.append('vps-image', image);
	formData.append('vps-image-data-url', dataUrl);

	const response = await HttpService.post('/api/images/upload/vps', {
		body: formData
	});
	if (!response.ok)
		return error(response.response.message || 'Error al subir la imagen al servidor vps');
	if (!response.response.url) return error('No se ha podido obtener la URL de la imagen subida');
	return { error: false, message: '', data: response.response.url as string };
}

export const VpsService = {
	uploadVpsImage
};

export default VpsService;
