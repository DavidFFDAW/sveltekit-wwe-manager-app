import { ChampionshipRepository } from '$lib/server/dao/repositories/championship.repository.js';
import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';
import { TeamsRepository } from '$lib/server/dao/repositories/teams.repository';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';

export async function load({ url }) {
	const reignId = url.searchParams.get('reign');
	let reign = null;
	const championshipRepo = new ChampionshipRepository();
	const wrestlersRepo = new WrestlerRepository();
	const teamsRepository = new TeamsRepository();

	if (reignId) {
		const reignsRepo = new ReignsRepository();
		reign = await reignsRepo.getSingleById(Number(reignId));
	}

	const selectableTeams = await teamsRepository.get({
		where: { active: true },
		orderBy: { name: 'asc' },
		include: { WrestlerTeam: { include: { Wrestler: true } } }
	});
	const finalParsedTeams = selectableTeams.map((team: any) => {
		return {
			...team,
			members: team.WrestlerTeam.map((wt: any) => wt.Wrestler)
		};
	});

	const wrestlers = await wrestlersRepo.get({
		orderBy: { name: 'asc' }
	});

	return {
		reign,
		isUpdate: Boolean(reignId) && reign !== null,
		championships: await championshipRepo.get({
			where: { active: true },
			orderBy: { name: 'asc' }
		}),
		wrestlers: wrestlers.map((w) => ({
			...w,
			image: w.image_name
		})),
		finalParsedTeams
	};
}
