import prisma from '$lib/server/prisma';

export async function load() {
    return {
        ppvs: await prisma.ppv.findMany({
            orderBy: {
                game_date: 'desc',
            },
        }),
    };
}
