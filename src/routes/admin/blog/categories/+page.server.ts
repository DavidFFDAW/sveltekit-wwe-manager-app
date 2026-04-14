import type { PageServerLoad } from './$types';

export const load = (async () => {
	const categories = ['General', 'Rumors', 'Results', 'Analysis', 'Podcast'];
	return {
		categories
	};
}) satisfies PageServerLoad;