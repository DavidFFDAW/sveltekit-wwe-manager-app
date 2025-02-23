import { IMAGE_API_URL } from '$env/static/private';
import { Helpers } from '$lib/server/server.helpers.js';

export async function POST({ locals, request }) {
	if (!locals.user?.api_token || !Helpers.hasPermission(locals, 'admin'))
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	try {
		const apiToken: string = locals.user?.api_token;
		const formData = await request.formData();
		const image = formData.get('vps-image') as File;
		const imageDataURL = formData.get('vps-image-data-url') as string;
		if (!imageDataURL) return Helpers.apiResponseMessage('No image data URL provided', 400);

		if (image.size / 1024 > 120)
			return Helpers.apiResponseMessage('Archivo demasiado grande para la subida', 401);

		const api = `${IMAGE_API_URL}image/bydataurl/upsert`;
		const requestBody = new FormData();
		requestBody.append('data_url', imageDataURL);
		const savingName = Helpers.slugify(image.name);
		requestBody.append('name', savingName);

		const options: RequestInit = {
			method: 'POST',
			mode: 'cors',
			headers: {
				Authorization: 'Bearer ' + apiToken
			},
			body: requestBody
		};
		const uploadResponse = await fetch(`${api}?fileToDelete=${savingName}`, options);
		if (!uploadResponse.ok)
			return Helpers.apiResponseMessage('No se ha podido subir la imagen al servidor', 500);

		const uploadResponseContent = await uploadResponse.json();
		if (!uploadResponseContent.data || uploadResponseContent.data.length <= 0)
			return Helpers.apiResponseMessage('La respuesta del servidor está vacía', 500);

		const newImageURL = uploadResponseContent.data.length
			? uploadResponseContent.data[0].url
			: uploadResponseContent.data.url;

		if (!newImageURL)
			return Helpers.apiResponseMessage('No se ha podido obtener la URL de la imagen subida', 500);

		return Helpers.apiResponse(
			{
				url: newImageURL
			},
			201
		);
	} catch (apiResponseMessage: any) {
		if (apiResponseMessage instanceof apiResponseMessage)
			return Helpers.apiResponseMessage(`apiResponseMessage: ${apiResponseMessage.message}`, 500);
		return Helpers.apiResponseMessage('Ha ocurrido un apiResponseMessage', 500);
	}
}
