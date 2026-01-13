import type { ImageServiceDataProp, ImageServiceInterface } from '../types';
import type { Cookies } from '@sveltejs/kit';
import { ImgurServerService } from '../../imgur.server.service';
import type { ImgurImage } from '../../../../../@types/Imgur';

export const getToken = async (cookies: Cookies): Promise<string> => {
	const storedToken = cookies.get('imgur_access_token');
	if (storedToken) return storedToken;
	console.log({ storedToken });

	const accessToken = await ImgurServerService.getAndSaveAccessToken(cookies);
	if (!accessToken) return '';

	if (accessToken instanceof Error) return '';
	return accessToken;
};

export const ImgurImageService: ImageServiceInterface = {
	getImages: async (data: ImageServiceDataProp) => {
		const { cookies } = data;
		const accessToken = await getToken(cookies);
		if (!accessToken || accessToken === '') return [];

		const imagesResponse = await ImgurServerService.getUserImages(accessToken);
		const images = imagesResponse.response.data as ImgurImage[];

		return images.map((img) => ({
			name: img.title,
			url: img.link
		}));
	},
	uploadImage: async (data: ImageServiceDataProp, file: File) => {
		const token = data.locals.user?.api_token;
		if (!token) return { error: true, message: 'Usuario no autenticado' };
		if (!file) return { error: true, message: 'No se ha proporcionado ningún archivo' };

		return { error: true, message: 'Servicio de imagen no implementado' };
	}
};
