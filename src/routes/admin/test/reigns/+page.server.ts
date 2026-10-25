import { championship } from "$lib/server/dao/repositories/championship.repository";

export async function load() {
    const reign = {
        championshipId: 26
    }

    return {
        reign,
        championships: await championship.get({
            where: {
                active: true,
            },
            orderBy: [
                { name: 'asc' },
                { brand: 'asc' },
                { order: 'asc' }
            ]
        })
    };
}
