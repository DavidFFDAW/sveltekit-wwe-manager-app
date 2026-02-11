import { ChampionshipRepository } from '$lib/server/dao/repositories/championship.repository.js';
import { PPVRepository } from '$lib/server/dao/repositories/ppv.repository.js';
import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';
import { TeamsRepository } from '$lib/server/dao/repositories/teams.repository';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';
import { Helpers } from '$lib/server/server.helpers.js';

export async function load({ url }) {
	const reignId = url.searchParams.get('reign');
	let reign = null;
	const championshipRepo = new ChampionshipRepository();
	const wrestlersRepo = new WrestlerRepository();
	const teamsRepository = new TeamsRepository();
	const ppvRepo = new PPVRepository();

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
		select: { id: true, name: true, slug: true, image_name: true, status: true, sex: true },
		where: { status: { not: 'released' } },
		orderBy: { slug: 'asc' }
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
		ppvs: await ppvRepo.getActiveNames(),
		finalParsedTeams
	};
}

export const actions = {
	upsert: async ({ request, locals }) => {
		const formData = await request.formData();
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para realizar esta acción', 403);

		const championshipId = formData.get('championship_id');
		const action = formData.get('action');
		const type = formData.get('type');
		const end_date = formData.get('end_date');
		const is_active = !Boolean(end_date);

		const chpRepo = new ChampionshipRepository();
		const championship = await chpRepo.getSingleById(Number(championshipId));
		if (!championship) return Helpers.error('El campeonato seleccionado no existe', 400);

		for (const [key, value] of formData.entries()) {
			console.log(key, value);
		}

		console.log({
			championshipId,
			championship,
			end_date,
			is_active,
			action,
			type
		});

		return Helpers.error('No se ha implementado la acción de guardar el reinado aún.', 500);
	}
};
