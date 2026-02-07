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
		select: { id: true, name: true, image_name: true, status: true, sex: true },
		where: { status: { not: 'released' } },
		orderBy: { name: 'asc' }
	});
	const championships = await championshipRepo.get({
		select: { id: true, name: true, image: true, brand: true, gender: true, tag: true },
		where: { active: true },
		orderBy: { name: 'asc' }
	});

	return {
		reign,
		isUpdate: Boolean(reignId) && reign !== null,
		championships: championships,
		championshipsMap: new Map(championships.map((c) => [c.id, c])),
		wrestlers: wrestlers.map((w) => ({
			...w,
			image: w.image_name
		})),
		wrestlersMap: new Map(wrestlers.map((w) => [w.id, w])),
		finalParsedTeams
	};
}
