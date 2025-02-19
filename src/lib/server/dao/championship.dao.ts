import prisma from '../prisma';

export const ChampionshipDao = {
	getChampionships: (config: {} = {}) => {
		return prisma.championship.findMany(config);
	},
	getAdminChampionships: (config: {} = {}) => {
		// get all championships and if they have reigns assigned
		return prisma.championship.findMany({
			...config,
			include: {
				ChampionshipReign: {
					select: {
						id: true
					}
				}
			},
			orderBy: [{ active: 'desc' }, { name: 'desc' }]
		});
	},
	getChampionshipByID: (id: number) => {
		return prisma.championship.findUnique({
			where: {
				id
			}
		});
	},
	getAdminChampionshipByID: (id: number) => {
		return prisma.championship.findUnique({
			where: {
				id
			},
			include: {
				ChampionshipReign: {
					include: {
						Wrestler: true,
						Team: true,
						Partner: true
					},
					orderBy: {
						won_date: 'asc'
					}
				}
			}
		});
	},
	updateActive: (id: number, active: boolean) => {
		return prisma.championship.update({
			where: {
				id
			},
			data: {
				active: active
			}
		});
	}
};
