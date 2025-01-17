import prisma from '$lib/server/prisma';

export async function load({ url }) {
    const params = url.searchParams;
    console.log(Object.fromEntries(params));

    // Cargar usuarios desde la base de datos usando Prisma
    const wrestlers = await prisma.wrestler.findMany({
        orderBy: {
            name: 'asc',
        },
        where: {
            name: {
                contains: params.get('search') || '',
            },
        },
        take: 10,
    });

    return { wrestlers };
}
