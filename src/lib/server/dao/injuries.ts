import type { Prisma } from '@prisma/client';
import prisma from '../prisma';

export const injuries = {
	get: (id: number) => {
		return prisma.injuries.findUnique({
			where: { id }
		});
	},
	getAll: (filter: Prisma.InjuriesWhereInput = {}) => {
		return prisma.injuries.findMany({
			where: filter,
			orderBy: { end_date: 'desc' }
		});
	},
	create: (data: Prisma.InjuriesCreateInput) => {
		return prisma.injuries.create({
			data
		});
	},
	update: (id: number, data: Prisma.InjuriesUpdateInput) => {
		return prisma.injuries.update({
			where: { id },
			data
		});
	},
	delete: (id: number) => {
		return prisma.injuries.delete({
			where: { id }
		});
	}
};
export default injuries;
