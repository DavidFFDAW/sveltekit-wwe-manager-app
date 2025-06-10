import type { Prisma } from '@prisma/client';
import prisma from '../prisma';

export const ReignsDao = {
	getChampionshipReigns: () => {
		return prisma.championshipReign.findMany({
			orderBy: [
				{
					won_date: 'desc'
				},
				{
					Championship: {
						brand: 'asc'
					}
				}
			],
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
	getCurrentReigns: () => {
		return prisma.championshipReign.findMany({
			where: {
				current: true,
				lost_date: null
			},
			include: {
				Wrestler: true,
				Championship: true,
				Partner: true,
				Team: true
			},
			orderBy: [{ won_date: 'desc' }]
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
	},
	getCurrentChampionsDefences: () => {
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
			orderBy: {
				won_date: 'desc'
			}
		});
	},

	getLastCurrentReignFromChampionship: (championship_id: number) => {
		return prisma.championshipReign.findFirst({
			where: {
				championship_id,
				current: true,
				lost_date: null
			},
			orderBy: {
				won_date: 'desc'
			}
		});
	},

	createChampionshipReign: (
		data: Prisma.ChampionshipReignUncheckedCreateInput | Prisma.ChampionshipReignCreateInput
	) => {
		return prisma.championshipReign.create({
			data
		});
	},

	updateChampionshipReign: (
		id: number,
		data: Prisma.ChampionshipReignUpdateInput | Prisma.ChampionshipReignUncheckedUpdateInput
	) => {
		return prisma.championshipReign.update({
			where: {
				id
			},
			data
		});
	},

	updateCurrentChampionshipReignDays: () => {
		return prisma.championshipReign.updateMany({
			data: {
				days: {
					increment: 1
				}
			},
			where: {
				AND: [{ lost_date: null }, { current: true }, { won_date: { lte: new Date() } }]
			}
		});
	},

	updateDefencesFor: (reigns: number[]) => {
		return prisma.championshipReign.updateMany({
			where: {
				id: {
					in: reigns
				}
			},
			data: {
				defences: {
					increment: 1
				}
			}
		});
	}
};
