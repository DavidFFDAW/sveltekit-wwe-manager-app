import prisma from '../prisma';
import type { Prisma } from '@prisma/client';
import { Utils } from '$lib/utils/general.utils';

export const cronjobs = {
	get: () => {
		return prisma.cronjobs.findMany();
	},
	getBySlug: (slug: string) => {
		return prisma.cronjobs.findUnique({
			where: { slug }
		});
	},
	getActiveCrons: () => {
		return prisma.cronjobs.findMany({
			where: { active: true }
		});
	},
	create: (data: Prisma.CronjobsCreateInput) => {
		return prisma.cronjobs.create({ data });
	},
	update: (id: number, data: Prisma.CronjobsUpdateInput) => {
		return prisma.cronjobs.update({
			where: { id },
			data
		});
	},
	updateMany: (data: Prisma.CronjobsUpdateManyMutationInput) => {
		return prisma.cronjobs.updateMany({
			data
		});
	},
	updateExecutionDate: (slug: string) => {
		const localDate = Utils.getLocalDate();
		return prisma.cronjobs.update({
			where: {
				slug: slug
			},
			data: {
				last_executed: localDate
			}
		});
	},
	updateManyExecutionDate: () => {
		const localDate = Utils.getLocalDate();
		return prisma.cronjobs.updateMany({
			data: {
				last_executed: localDate
			}
		});
	},
	delete: (id: number) => {
		return prisma.cronjobs.delete({
			where: { id }
		});
	}
};
export default cronjobs;
