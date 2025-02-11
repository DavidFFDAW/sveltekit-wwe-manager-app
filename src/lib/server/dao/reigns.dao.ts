import prisma from '../prisma';

export const ReignsDao = {
	getChampionshipReigns: () => {
		return prisma.championshipReign.findMany({
			orderBy: {
				won_date: 'desc'
			},
			include: {
				Wrestler: true,
				Championship: true,
				Partner: true,
				Team: true
			}
		});
	},
	getChampionshipReignByID: (id: number) => {
		return prisma.championshipReign.findUnique({
			where: {
				id
			},
			include: {
				Wrestler: true,
				Championship: true,
				Partner: true,
				Team: true
			}
		});
	},

	getCurrentChampionshipReign: () => {
		return prisma.championshipReign.findMany({
			where: {
				current: true,
				lost_date: null,
				can_stats_count: true,
				Championship: {
					active: true
				}
			},
			include: {
				Wrestler: true,
				Championship: true,
				Partner: true,
				Team: true
			},
			orderBy: [{ Championship: { brand: 'asc' } }, { Championship: { order: 'asc' } }]
		});
	}
};
