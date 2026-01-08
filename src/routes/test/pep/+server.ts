import { Helpers } from '$lib/server/server.helpers';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!Helpers.hasPermission(locals)) return Helpers.api.error('Unauthorized', 401);
	if (!url.searchParams.has('search')) return Helpers.api.error('Missing search param', 400);

	const search = url.searchParams.get('search') as string;
	const source = `https://www.google.com/search?q=${search}&igu=1&tbm=isch`;
	const response = await fetch(source, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
	if (!response.ok) return Helpers.api.error('Error fetching data from source', 500);
	const html = await response.text();

	// get all <img> tags from html
	const imgTagRegex = /<img[^>]+src="([^">]+)"/g;
	const imgTags = [];
	let match;
	while ((match = imgTagRegex.exec(html)) !== null) {
		imgTags.push(match[1]);
	}
	return Helpers.api.json({ images: imgTags });
};
