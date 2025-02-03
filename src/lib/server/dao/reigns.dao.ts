import prisma from '../prisma';

export const ReignsDao = {
    getChampionshipReigns: () => {
        return prisma.championshipReign.findMany({
            orderBy: {
                won_date: 'desc',
            },
            include: {
                Wrestler: true,
                Championship: true,
                Partner: true,
                Team: true,
            },
        });
    },
    getChampionshipReignByID: (id: number) => {
        return prisma.championshipReign.findUnique({
            where: {
                id,
            },
            include: {
                Wrestler: true,
                Championship: true,
                Partner: true,
                Team: true,
            },
        });
    },
};
