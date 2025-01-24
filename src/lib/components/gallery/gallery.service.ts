export interface GalleryImage {
	url: string;
	name: string;
	size: number;
	date: number;
	type: string;
	extension: string;
}

export async function getGalleryImages() {
	const res = await fetch('https://davidfernandezdeveloper.es/2k/api/v2/images');
	if (res.status !== 200 || !res.ok) return [];
	const { data } = await res.json();
	return data.images;
}
