import prisma from '$lib/server/prisma';

export async function load() {
  // Cargar usuarios desde la base de datos usando Prisma
	const wrestlers = await prisma.wrestler.findMany({
		orderBy: {
			name: 'asc',
		},
		take: 10,
  	});

  	return { wrestlers };
}