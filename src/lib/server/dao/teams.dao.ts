import type { Prisma } from '@prisma/client';
import prisma from '../prisma';

export const TeamsDao = {
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

	getReignBySlug: (slug: string) => {
		return prisma.team.findFirst({
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

	bulkUpdateGender: (gender: string, idList: number[]) => {
		return prisma.team.updateMany({
			where: { id: { in: idList } },
			data: { gender }
		});
	},
	toggleActive: (id: number) => {
		return prisma.$executeRaw`UPDATE teams SET active = !active WHERE id = ${id}`;
	}
};
