import type { Prisma, Wrestler } from '@prisma/client';
import prisma from '../prisma';

export const TeamsDao = {
	getTeamGenderBasedOnWrestlers: (wrestlers: Wrestler[]) => {
		if (wrestlers.every((wrt) => wrt.sex.toLowerCase() === 'f')) return 'f';
		if (wrestlers.every((wrt) => wrt.sex.toLowerCase() === 'm')) return 'm';
		return 'x';
	},
	getAdminTeams: (where: Prisma.TeamWhereInput) => {
		return prisma.team.findMany({
			where: where,
			include: {
				WrestlerTeam: {
					include: {
						Wrestler: true
					}
				},
				ChampionshipReign: true
			}
		});
	},

	getReignBySlug: async (slug: string) => {
		const team = await prisma.team.findFirst({
			where: {
				OR: [{ slug: slug }, { id: Number(slug) }]
			},
			include: {
				WrestlerTeam: {
					include: {
						Wrestler: true
					}
				}
			}
		});

		if (!team) return null;
		return {
			...team,
			members: team.WrestlerTeam.map((wrestler) => wrestler.Wrestler) as Wrestler[]
		};
	},

	getReignSelectableTeams: async () => {
		const teams = await prisma.team.findMany({
			include: {
				WrestlerTeam: {
					include: {
						Wrestler: {
							select: {
								id: true,
								name: true,
								image_name: true,
								sex: true
							}
						}
					}
				}
			}
		});

		return teams.map((team) => {
			return {
				id: team.id,
				name: team.name,
				image: team.WrestlerTeam[0].Wrestler.image_name,
				members: team.WrestlerTeam.map((wrestler) => {
					return {
						id: wrestler.Wrestler.id,
						name: wrestler.Wrestler.name,
						image: wrestler.Wrestler.image_name,
						sex: wrestler.Wrestler.sex
					};
				})
			};
		});
	},
	getTeamMembersIdByTeamId: async (id: number) => {
		const team = await prisma.team.findUnique({
			where: {
				id
			},
			include: {
				WrestlerTeam: true
			}
		});

		if (!team) return [];
		return team.WrestlerTeam.map((wrestler) => wrestler.wrestler_id) as number[];
	},
	createTeam(team: Prisma.TeamCreateInput) {
		return prisma.team.create({ data: team });
	},
	updateTeam(id: number, team: Prisma.TeamUpdateInput) {
		return prisma.team.update({
			data: team,
			where: { id }
		});
	},
	bulkUpdateGender: (gender: string, idList: number[]) => {
		return prisma.team.updateMany({
			where: { id: { in: idList } },
			data: { gender }
		});
	},
	toggleActive: (id: number) => {
		return prisma.$executeRaw`UPDATE teams SET active = !active WHERE id = ${id}`;
	},
	deleteTeam: async (uuid: number) => {
		await prisma.wrestlerTeam.deleteMany({
			where: {
				team_id: uuid
			}
		});

		return prisma.team.delete({
			where: {
				id: uuid
			}
		});
	}
};
