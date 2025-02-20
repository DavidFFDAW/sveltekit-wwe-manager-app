import { ReignUtils } from '$lib/utils/reign.utils';
import type { Prisma } from '@prisma/client';
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
						won_date: 'desc'
					}
				}
			}
		});
	},

	createChampionship: (data: Prisma.ChampionshipUncheckedCreateInput) => {
		return prisma.championship.create({
			data
		});
	},
	deactivateCurrentChampionshipReign: async (championshipId: number) => {
		const lastCurrent = await prisma.championshipReign.findFirst({
			where: {
				championship_id: championshipId,
				current: true,
				lost_date: null
			},
			orderBy: {
				won_date: 'desc'
			}
		});
		if (!lastCurrent) return false;
		const newDays = ReignUtils.getDaysBetweenDates(lastCurrent.won_date, new Date());

		return prisma.championshipReign.update({
			where: {
				id: lastCurrent.id,
				current: true,
				lost_date: null
			},
			data: {
				current: false,
				lost_date: new Date(),
				days: newDays
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
	},
	updateChampionship: (id: number, data: Prisma.ChampionshipUncheckedUpdateInput) => {
		return prisma.championship.update({
			where: {
				id
			},
			data
		});
	},
	deleteChampionship: (id: number) => {
		return prisma.championship.delete({
			where: {
				id
			}
		});
	}
};
