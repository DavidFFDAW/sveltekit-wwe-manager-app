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
		select: {
			id: true,
			name: true,
			image: true,
			tag: true,
			order: true
		},
		where: { active: true },
		orderBy: [{ tag: 'desc' }, { order: 'asc' }]
	});

	const members = reign ? [reign.wrestler_id, reign.partner] : [];

	return {
		reign,
		members,
		championships: championships,
		isUpdate: Boolean(reignId) && reign !== null,
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

		const updateId = Helpers.getUpdateID(formData);
		const championshipId = formData.get('championship_id');
		const action = formData.get('action');
		const type = formData.get('tag_type');
		const end_date = formData.get('end_date');
		const is_active = !Boolean(end_date);
		const wrestlerId = formData.get('wrestler_id');

		const teamId = formData.get('team_id');
		const originalMembersLength = Number(formData.get('team_original_members_length') || 0);
		const teamMembers = formData.getAll('member_ids[]');
		const members = teamMembers
			.slice(0, 2)
			.map((id) => Number(id))
			.filter((id) => !isNaN(id));

		const chpRepo = new ChampionshipRepository();
		const championship = await chpRepo.getSingleById(Number(championshipId));
		if (!championship) return Helpers.error('El campeonato seleccionado no existe', 400);

		for (const [key, value] of formData.entries()) {
			console.log(key, value);
		}

		console.log({
			championshipId,
			championship: championship.name,
			end_date,
			is_active,
			action,
			type,
			wrestlerId,
			teamId,
			originalMembersLength,
			members
		});

		return Helpers.error('No se ha implementado la acción de guardar el reinado aún.', 500);
	}
};
