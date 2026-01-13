import { ImageService } from '$lib/server/services/images/image.service.js';

export async function load({ url, cookies, locals }) {
	const maxItemsPerPage = 20;
	const urlPage = parseInt(url.searchParams.get('page') || '1', 10);
	const page = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

	const urlProvider = url.searchParams.get('provider') || 'gallery';
	const provider = ['gallery', 'imgur'].includes(urlProvider) ? urlProvider : 'gallery';

	const images = await ImageService.getImages(
		{
			cookies,
			locals,
			searchParams: url.searchParams
		},
		provider
	);

	return {
		page,
		provider,
		maxPages: Math.ceil(images.length / maxItemsPerPage),
		perPage: maxItemsPerPage,
		total: images.length,
		gallery:
			images.length > maxItemsPerPage
				? images.slice((page - 1) * maxItemsPerPage, page * maxItemsPerPage)
				: images
	};
}
