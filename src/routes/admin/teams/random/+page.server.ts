import { TeamsDao } from '$lib/server/dao/teams.dao.js';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';
import type { Prisma } from '@prisma/client';

export const load = async ({ url }) => {
	const params = url.searchParams;
	const paramsObject = Object.fromEntries(params);
	if (Object.keys(paramsObject).length === 0) return { wrestlers: [] };

	const gender = paramsObject.members_gender;
	const howMany = Number.isNaN(paramsObject.how_many_members)
		? 0
		: Number(paramsObject.how_many_members);
	const allWrestlers = await WrestlerDao.getWrestlers();
	const filteredWrestlers = !gender
		? allWrestlers
		: allWrestlers.filter((wrestler) => wrestler.sex === gender);

	return {
		wrestlers: filteredWrestlers.sort(() => Math.random() - Math.random()).slice(0, howMany)
	};
};

export const actions = {
	createRandomTeam: async ({ request }) => {
		const formData = await request.formData();
		const members = formData.getAll('wrestlers[]');
		const teamName = formData.get('team_name');
		const slug = formData.get('team_slug');
		const active = Helpers.getToggleInput(formData, 'team_status');
		const brand = formData.get('team_brand');

		try {
			const team: Prisma.TeamCreateInput = {
				name: teamName as string,
				slug: slug as string,
				brand: brand ? (brand as string) : 'raw',
				active,
				WrestlerTeam: {
					create: members.map((member) => ({
						wrestler_id: Number(member)
					}))
				}
			};

			await TeamsDao.createTeam(team);
			return Helpers.success('Equipo creado correctamente');
		} catch (error) {
			console.error('Error al crear el equipo', error);
			return Helpers.error('Error al crear el equipo');
		}
	}
};
