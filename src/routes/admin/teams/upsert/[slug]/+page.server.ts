import { TeamsDao } from '$lib/server/dao/teams.dao.js';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ params }) => {
	const { slug } = params;
	if (!slug) return Helpers.redirection('/admin/teams');

	return { team: await TeamsDao.getReignBySlug(slug), wrestlers: await WrestlerDao.getWrestlers() };
};

export const actions = {
	default: async ({ request, params, locals }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para realizar esta acción', 403);

		const slugParameter = Helpers.getUrlSlug(params, 'slug');
		if (!slugParameter) return Helpers.error('No se ha proporcionado el slug del equipo', 400);

		const formData = await request.formData();
		const updateId = Helpers.getUpdateID(formData);
		if (!updateId) return Helpers.error('No se ha proporcionado el ID del equipo', 400);
		if (updateId !== slugParameter)
			return Helpers.error('El ID del equipo no coincide con el slug', 400);

		const teamMembers = formData.getAll('team-single-member-selector-id[]') as string[];
		const teamMemberIds = teamMembers.map((member) => Number(member));

		if (teamMemberIds.length < 2)
			return Helpers.error('Un equipo debe tener al menos 2 miembros', 400);
		if (teamMemberIds.length > 5)
			return Helpers.error('Un equipo puede tener como máximo 5 miembros', 400);

		try {
			// recalculate gender of this team
			const oldTeamMembers = (await TeamsDao.getTeamMembersIdByTeamId(updateId)).map((id) =>
				id.toString()
			);
			const toCreate = teamMembers.filter((member: string) => !oldTeamMembers.includes(member));
			const toDelete = oldTeamMembers.filter((member: string) => !teamMembers.includes(member));

			const memberWrestlers = await WrestlerDao.getManyWrestlersById(teamMemberIds);
			const teamGender = TeamsDao.getTeamGenderBasedOnWrestlers(memberWrestlers);

			const updatedTeam = await TeamsDao.updateTeam(updateId, {
				name: formData.get('team-name') as string,
				slug: formData.get('team-slug') as string,
				average: Number(formData.get('team-average')),
				gender: teamGender,
				brand: formData.get('brand') as string,
				active: Helpers.getToggleInput(formData, 'team-active'),
				WrestlerTeam: {
					deleteMany: toDelete.map((id) => ({ wrestler_id: Number(id) })),
					create: toCreate.map((id) => ({
						wrestler_id: Number(id)
					}))
				}
			});
			if (!updatedTeam) return Helpers.error('No se ha podido actualizar el equipo', 500);
			return Helpers.success('Equipo actualizado correctamente', 200);
		} catch (error) {
			console.error(error);
			return Helpers.error('Error al actualizar el equipo', 500);
		}
	}
};
