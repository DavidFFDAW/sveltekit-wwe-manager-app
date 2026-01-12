import type { ImageServiceDataProp, ImageServiceInterface } from '../types';

export const GoogleImageService: ImageServiceInterface = {
	getImages: async (data: ImageServiceDataProp) => {
		const search = data.searchParams.get('search');
		if (!search) return [];

		const source = `https://www.google.com/search?q=${search}&igu=1&tbm=isch`;
		const response = await fetch(source, {
			method: 'GET',
			headers: { 'User-Agent': 'Mozilla/5.0' }
		});
		if (!response.ok) return [];

		const html = await response.text();
		const imgTagRegex = /<img[^>]+src="([^">]+)"/g;
		const imgTags = [];
		let match;
		while ((match = imgTagRegex.exec(html)) !== null) {
			imgTags.push(match[1]);
		}

		return imgTags
			.filter((url) => !url.startsWith('/images/'))
			.map((url, index) => ({
				name: `google_image_${index + 1}`,
				url
			}));
	},
	uploadImage: async () => {
		return { error: true, message: 'No se puede subir imágenes a Google Images' };
	}
};
