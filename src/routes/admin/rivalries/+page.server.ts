import { RivalriesRepository } from '$lib/server/dao/repositories/rivalries.repository.js';
import { TeamsRepository } from '$lib/server/dao/repositories/teams.repository';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';

export async function load() {
	const rivalriesRepository = new RivalriesRepository();
	const teamsRepository = new TeamsRepository();
	const wrestlerRepository = new WrestlerRepository();

	const wrestlers = (
		await wrestlerRepository.getNonReleasedWrestlers({
			select: { name: true }
		})
	).map((wrestler) => wrestler.name);
	const teams = await teamsRepository.getTeamsWithMembers({
		where: {
			active: true
		}
	});
	const teamNames = teams.map((team) => {
		if (team.WrestlerTeam.length > 2) {
			return team.name + ' (' + team.WrestlerTeam.map((wt) => wt.Wrestler.name).join(', ') + ')';
		}
		return team.name;
	});

	return { rivalries: await rivalriesRepository.get(), teams: teamNames, wrestlers };
}

export const actions = {};
