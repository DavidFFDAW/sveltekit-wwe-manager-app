import { IMAGE_API_URL } from '$env/static/private';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import prisma from '$lib/server/prisma';
import { Helpers } from '$lib/server/server.helpers.js';
// import fs from 'fs';

export const load = async ({ locals }) => {
	if (!locals.user) throw Helpers.redirection('/admin/dashboard');

	return {
		wrestlers: await prisma.wrestler.findMany({
			orderBy: {
				name: 'asc'
			}
		}),
		hasApiToken: Boolean(locals.user.api_token)
	};
};

export const actions = {
	upsertImage: async ({ request, locals }) => {
		if (!locals.user) return Helpers.error('Unauthorized', 401);
		if (locals.user.role !== 'admin') return Helpers.error('Unauthorized', 403);
		if (!locals.user.api_token) return Helpers.error('No API token found');

		const datas = await request.formData();
		const api = `${IMAGE_API_URL}image/bydataurl/upsert`;

		const imageDataURL = datas.get('editor-image-data-resource') as string;
		const { id, name } = Helpers.getSelectorItem(datas);
		if (!imageDataURL) return Helpers.error('No image data URL provided');

		try {
			const file = new File([Buffer.from(imageDataURL.split(',')[1], 'base64')], 'image.webp', {
				type: 'image/webp'
			});
			if (file.size / 1024 > 100)
				return Helpers.error('El tamaño de la imagen es demasiado grande para guardarla');

			const requestBody = new FormData();
			requestBody.append('data_url', imageDataURL);
			const savingName = Helpers.slugify(name);
			if (name) requestBody.append('name', savingName);

			const options: RequestInit = {
				method: 'POST',
				mode: 'cors',
				headers: {
					Authorization: 'Bearer ' + locals.user.api_token
				},
				body: requestBody
			};
			const uploadResponse = await fetch(`${api}?fileToDelete=${savingName}`, options);
			if (!uploadResponse.ok)
				return Helpers.error('No se ha podido subir la imagen al servidor', 500);

			const uploadResponseContent = await uploadResponse.json();
			if (!uploadResponseContent.data || uploadResponseContent.data.length <= 0)
				return Helpers.error('La respuesta del servidor está vacía', 500);

			const newImageURL = uploadResponseContent.data.length
				? uploadResponseContent.data[0].url
				: uploadResponseContent.data.url;
			if (!newImageURL)
				return Helpers.error('No se ha podido obtener la URL de la imagen subida', 500);

			if (id) {
				const updated = await WrestlerDao.updateImage(newImageURL, id);
				return Helpers.success(`Se ha actualizado la imagen de ${updated.name}`, 200);
			}

			return Helpers.success('Se ha subido la imagen al servidor', 200);
		} catch (error: any) {
			if (error instanceof Error) return Helpers.error(error.message, 500);
			return Helpers.error('Ha ocurrido un error', 500);
		}
	}
};
