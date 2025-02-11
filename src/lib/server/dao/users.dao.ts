import prisma from '../prisma';

export const UsersDao = {
	getAllUsers: () => {
		return prisma.user.findMany({
			include: {
				UserRole: true
			},
			orderBy: {
				created_at: 'desc'
			}
		});
	},
	getUserById: (id: string | number) => {
		return prisma.user.findUnique({
			where: {
				id: Number(id)
			}
		});
	}
};
