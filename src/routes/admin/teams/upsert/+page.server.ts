import { TeamsDao } from '$lib/server/dao/teams.dao';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers';

export const load = async () => {
	return { wrestlers: await WrestlerDao.getWrestlers() };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para realizar esta acción', 403);

		const formData = await request.formData();
		const teamMembers = formData.getAll('team-single-member-selector-id[]') as string[];
		const teamMemberIds = teamMembers.map((member) => Number(member));

		if (teamMemberIds.length < 2)
			return Helpers.error('Un equipo debe tener al menos 2 miembros', 400);
		if (teamMemberIds.length > 5)
			return Helpers.error('Un equipo puede tener como máximo 5 miembros', 400);

		try {
			const memberWrestlers = await WrestlerDao.getManyWrestlersById(teamMemberIds);
			const teamGender = TeamsDao.getTeamGenderBasedOnWrestlers(memberWrestlers);

			const createdTeam = await TeamsDao.createTeam({
				name: formData.get('team-name') as string,
				slug: formData.get('team-slug') as string,
				average: Number(formData.get('team-average')),
				gender: teamGender,
				brand: formData.get('brand') as string,
				active: Helpers.getToggleInput(formData, 'team-active'),
				WrestlerTeam: {
					create: teamMemberIds.map((id) => ({
						wrestler_id: id
					}))
				}
			});

			if (!createdTeam.id) return Helpers.error('No se ha podido actualizar el equipo', 500);
			return Helpers.success('Equipo actualizado correctamente', 200);
		} catch (error) {
			console.error(error);
			return Helpers.error('Error al actualizar el equipo', 500);
		}
	}
};
