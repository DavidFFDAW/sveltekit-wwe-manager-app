import { RivalriesRepository } from '$lib/server/dao/repositories/rivalries.repository.js';
import { TeamsRepository } from '$lib/server/dao/repositories/teams.repository';

export async function load() {
	const rivalriesRepository = new RivalriesRepository();
	const teamsRepository = new TeamsRepository();

	const teams = await teamsRepository.getTeamsWithMembers();
	const teamNames = teams.map((team) => {
		if (team.WrestlerTeam.length > 2) {
			return team.WrestlerTeam.map((wt) => wt.Wrestler.name).join(', ');
		}
		return team.name;
	});

	return { rivalries: await rivalriesRepository.get(), teams: teamNames };
}
