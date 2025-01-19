import prisma from '$lib/server/prisma';

export async function load() {
	return {
		wrestlers: await prisma.wrestler.findMany({
			orderBy: {
				name: 'asc'
			},

			take: 10
		})
	};
}
