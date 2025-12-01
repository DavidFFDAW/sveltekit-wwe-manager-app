import { PPVUtils } from '$lib/utils/ppv.utils';
import type { Prisma } from '@prisma/client';
import prisma from '../prisma';

export const PPVDao = {
	weeklyShows: ['Raw', 'SmackDown', 'AWL', 'Saturday Night Main Event'],
	getPPVs: () => {
		return prisma.pPV.findMany();
	},
	getFilterPPVs: (filter: Prisma.PPVWhereInput) => {
		return prisma.pPV.findMany({
			where: filter
		});
	},
	getOrderedNonYear: async (filter: Prisma.PPVWhereInput = {}) => {
		const ppvs = await prisma.pPV.findMany({
			where: filter
		});
		return PPVUtils.orderPPVsByMonthAndDay(ppvs);
	},
	getActivePPVs: () => {
		return prisma.pPV.findMany({
			where: {
				active: true
			}
		});
	},
	getOrderedPPVs: async (year: number = new Date().getFullYear()) => {
		const ppvs = await prisma.pPV.findMany();
		const parsedPPVs = ppvs.map((ppv) => {
			if (ppv.game_date) ppv.game_date.setFullYear(year);
			return ppv;
		});

		return PPVUtils.orderPPVsByMonthAndDay(parsedPPVs);
	},

	getDashboardNextPPV: () => {
		return prisma.pPV.findFirst({
			where: {
				active: true,
				game_date: {
					gte: new Date()
				}
			},
			orderBy: {
				game_date: 'asc'
			}
		});
	},
	getPPVNames: async (filters: Prisma.PPVWhereInput = { active: true }) => {
		return (
			await prisma.pPV.findMany({
				orderBy: {
					estimated_real_date: 'asc'
				},
				select: {
					name: true
				},
				where: filters
			})
		).map((ppv) => ppv.name) as string[];
	},
	getOrderedPPVNames: async (filters: Prisma.PPVWhereInput = { active: true }) => {
		const year = new Date().getFullYear();
		const ppvs = await prisma.pPV.findMany({
			where: filters
		});
		const parsedPPVs = ppvs.map((ppv) => {
			if (ppv.game_date) ppv.game_date.setFullYear(year);
			return ppv;
		});
		const orderedPPVs = PPVUtils.orderPPVsByMonthAndDay(parsedPPVs);
		return orderedPPVs.map((ppv) => ppv.name) as string[];
	},
	getPPVByID: (id: number) => {
		return prisma.pPV.findUnique({
			where: {
				id
			}
		});
	},
	createPPV: (data: Prisma.PPVCreateInput) => {
		return prisma.pPV.create({
			data
		});
	},
	toggleActive: async (id: number) => {
		await prisma.$executeRaw`UPDATE ppv SET active = !active WHERE id = ${id}`;

		return prisma.pPV.findUnique({
			where: { id }
		});
	},

	updateAllPPVYearDate: async (year: number) => {
		await prisma.$executeRaw`UPDATE ppv SET game_date = DATE_ADD(game_date, INTERVAL 1 YEAR) WHERE active = 1 AND YEAR(game_date) < ${year}`;
	},

	updatePPV: (id: number, data: Prisma.PPVUpdateInput) => {
		return prisma.pPV.update({
			where: { id },
			data
		});
	},

	deleteById: (id: number) => {
		return prisma.pPV.delete({
			where: { id }
		});
	}
};
