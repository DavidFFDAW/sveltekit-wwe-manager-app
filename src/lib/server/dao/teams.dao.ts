import prisma from '../prisma';

export const TeamsDao = {
	getTeams: () => {
		return prisma.team.findMany({
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
