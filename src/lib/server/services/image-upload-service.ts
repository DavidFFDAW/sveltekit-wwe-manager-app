import { IMAGE_API_URL } from '$env/static/private';

const sendRequest = async (formData: FormData, userApiToken: string, savingName: string) => {
	const options: RequestInit = {
		method: 'POST',
		mode: 'cors',
		headers: {
			Authorization: 'Bearer ' + userApiToken
		},
		body: formData
	};
	const api = `${IMAGE_API_URL}image/bydataurl/upsert`;
	return await fetch(`${api}?fileToDelete=${savingName}`, options);
};

export const ImageUploadService = {
	sendRequest,
	uploadImageFromDataURL: async (
		imageDataURL: string,
		slugifiedName: string,
		userApiToken: string
	): Promise<string> => {
		const file = new File(
			[Buffer.from(imageDataURL.split(',')[1], 'base64')],
			`${slugifiedName}.webp`,
			{
				type: 'image/webp'
			}
		);
		if (file.size / 1024 > 100)
			throw new Error('El tamaño de la imagen es demasiado grande para guardarla');

		const requestBody = new FormData();
		requestBody.append('data_url', imageDataURL);
		requestBody.append('name', slugifiedName);

		const uploadResponse = await sendRequest(requestBody, userApiToken, slugifiedName);
		if (!uploadResponse.ok) throw new Error('No se ha podido subir la imagen al servidor');

		const uploadResponseContent = await uploadResponse.json();
		if (!uploadResponseContent.data || uploadResponseContent.data.length <= 0)
			throw new Error('La respuesta del servidor está vacía');

		const newImageURL = uploadResponseContent.data.length
			? uploadResponseContent.data[0].url
			: uploadResponseContent.data.url;
		if (!newImageURL) throw new Error('No se ha podido obtener la URL de la imagen subida');

		return newImageURL;
	}
};
