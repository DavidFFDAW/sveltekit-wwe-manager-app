import prisma from '../prisma';

export const ChampionshipDao = {
    getChampionships: (config: {} = {}) => {
        return prisma.championship.findMany(config);
    },
    getChampionshipByID: (id: number) => {
        return prisma.championship.findUnique({
            where: {
                id,
            },
        });
    },
};
