import { rivalries } from '$lib/server/dao/repositories/rivalries.repository.js';
import { teams } from '$lib/server/dao/repositories/teams.repository';
import { wrestlers } from '$lib/server/dao/repositories/wrestler.repository';
import { Helpers } from '$lib/server/server.helpers.js';

export async function load() {

	const wrestlerNames = (
		await wrestlers.getNonReleasedWrestlers({
			select: { name: true }
		})
	).map((wrestler) => wrestler.name);
	const teamsList = await teams.getTeamsWithMembers({
		where: {
			active: true
		}
	});
	const teamNames = teamsList.map((team) => {
		if (team.WrestlerTeam.length > 2) {
			return team.name + ' (' + team.WrestlerTeam.map((wt) => wt.Wrestler.name).join(', ') + ')';
		}
		return team.name;
	});

	return { rivalries: await rivalries.get(), teams: teamNames, wrestlers: wrestlerNames };
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const action = Helpers.getAction(formData);

		try {

			const updateID = Helpers.getUpdateID(formData);
			const isUpdateResource = action === 'update' && updateID > 0;

			const { error, message } = Helpers.checkRequiredFields(
				formData,
				rivalries.getRequiredFields()
			);
			if (error) return Helpers.error(message, 400);

			const rivalryData = {
				first_rival: formData.get('first_rival') as string,
				second_rival: formData.get('second_rival') as string,
				intensity: formData.get('intensity') as string,
				brand: formData.get('brand') as string
			};
			if (!isUpdateResource) await rivalries.create(rivalryData);
			if (isUpdateResource) await rivalries.updateById(updateID, rivalryData);

			return Helpers.success('Se han guardado los cambios en la rivalidad de forma correcta.');
		} catch (error) {
			console.error('Error handling form submission:', error);
			return Helpers.error('Internal server error', 500);
		}
	}
};
