import prisma from '$lib/server/prisma';

export const load = async () => {
	const cronjobs = await prisma.cronjobs.findMany();
	return { cronjobs };
};

export const actions = {};
