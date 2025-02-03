import prisma from '../prisma';

export const PPVDao = {
    getPPVs: (config: {} = {}) => {
        return prisma.pPV.findMany(config);
    },
    getPPVNames: async () => {
        return (
            await prisma.pPV.findMany({
                orderBy: {
                    estimated_real_date: 'asc',
                },
                select: {
                    name: true,
                },
                where: {
                    active: true,
                },
            })
        ).map(ppv => ppv.name) as string[];
    },
    getPPVByID: (id: number) => {
        return prisma.pPV.findUnique({
            where: {
                id,
            },
        });
    },
};
