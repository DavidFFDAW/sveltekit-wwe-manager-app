import prisma from '$lib/server/prisma';

export async function load({ url }) {
	const search = url.searchParams.has('search') ? (url.searchParams.get('search') as string) : '';
	return {
		search,
		wrestlers: await prisma.wrestler.findMany({
			orderBy: {
				name: 'asc'
			},
			where: {
				name: {
					contains: search
				}
			},

			take: 10
		})
	};
}
