import { PPVUtils } from '$lib/utils/ppv.utils';
import type { Prisma } from '@prisma/client';
import prisma from '../prisma';

export const PPVDao = {
	getPPVs: () => {
		return prisma.pPV.findMany();
	},
	getFilterPPVs: (filter: Prisma.PPVWhereInput) => {
		return prisma.pPV.findMany({
			where: filter
		});
	},
	getActivePPVs: () => {
		return prisma.pPV.findMany({
			where: {
				active: true,
				visible: true
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
	getPPVNames: async () => {
		return (
			await prisma.pPV.findMany({
				orderBy: {
					estimated_real_date: 'asc'
				},
				select: {
					name: true
				},
				where: {
					active: true
				}
			})
		).map((ppv) => ppv.name) as string[];
	},
	getPPVByID: (id: number) => {
		return prisma.pPV.findUnique({
			where: {
				id
			}
		});
	},
	toggleVisibility: async (id: number) => {
		await prisma.$executeRaw`UPDATE ppv SET visible = !visible WHERE id = ${id}`;

		return prisma.pPV.findUnique({
			where: { id }
		});
	},

	toggleActive: async (id: number) => {
		await prisma.$executeRaw`UPDATE ppv SET active = !active WHERE id = ${id}`;

		return prisma.pPV.findUnique({
			where: { id }
		});
	},

	deleteById: (id: number) => {
		return prisma.pPV.delete({
			where: { id }
		});
	}
};
