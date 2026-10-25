import { wrestlers } from '$lib/server/dao/repositories/wrestler.repository';
import type { PageServerLoad } from './$types';

export const load = (async () => {

	return {
		wrestlers: await wrestlers.get({
			take: 50,
			where: {
				status: { notIn: ['released'] }
			},
			orderBy: { name: 'asc' }
		})
	};
}) satisfies PageServerLoad;
