import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const wrestlerRepo = new WrestlerRepository();
	return {
		wrestlers: await wrestlerRepo.get({
			take: 50,
			where: {
				status: { notIn: ['released'] }
			},
			orderBy: { name: 'asc' }
		})
	};
}) satisfies PageServerLoad;
