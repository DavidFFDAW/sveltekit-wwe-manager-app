import { ChampionshipRepository } from "$lib/server/dao/repositories/championship.repository";

export async function load() {
    const reign = {
        championshipId: 26
    }
    const championshipsRepository = new ChampionshipRepository();

    return {
        reign,
        championships: await championshipsRepository.get({
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