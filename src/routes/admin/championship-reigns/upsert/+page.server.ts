import { ChampionshipRepository } from '$lib/server/dao/repositories/championship.repository.js';
import { PPVRepository } from '$lib/server/dao/repositories/ppv.repository.js';
import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';
import { TeamsRepository } from '$lib/server/dao/repositories/teams.repository';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';
import { Helpers } from '$lib/server/server.helpers.js';
import type { Prisma } from '@prisma/client';

type UpsertObject = Prisma.ChampionshipReignUpdateInput | Prisma.ChampionshipReignCreateInput;

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
	const currentTagType: 'team' | 'manual' = reign
		? reign.wrestler_id && reign.partner && !reign.team_id
			? 'manual'
			: 'team'
		: 'team';

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
		finalParsedTeams,
		currentTagType
	};
}

export const actions = {
	upsert: async ({ request, locals }) => {
		const formData = await request.formData();
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para realizar esta acción', 403);

		const neededDatas = ['championship_id', 'start_date'];
		const missingData = Helpers.checkRequiredFields(formData, neededDatas);
		if (missingData.error) return Helpers.error(missingData.message, 400);

		const championshipId = Number(formData.get('championship_id'));
		if (isNaN(championshipId)) return Helpers.error('El ID del campeonato debe ser un número', 400);

		const chpRepo = new ChampionshipRepository();
		const championship = await chpRepo.getSingleById(championshipId);
		if (!championship) return Helpers.error('El campeonato seleccionado no existe', 400);

		const datas = {
			championshipId: championshipId,
			type: formData.get('tag_type'),
			currentTagType: formData.get('current_tag_type'),
			end_date: formData.get('end_date'),
			won_date: formData.get('start_date'),
			is_active: !formData.get('end_date'),
			wrestlerId: formData.get('wrestler_id'),
			teamId: formData.get('team_id'),
			victory_way: formData.get('victory_way') ? formData.get('victory_way')!.toString() : null,
			ppv_won: formData.get('ppv_won') ? formData.get('ppv_won')!.toString() : null,
			members: (formData.getAll('member_ids[]') as string[])
				.slice(0, 2)
				.map((id) => Number(id))
				.filter((id) => !isNaN(id))
		};

		const updateId = Helpers.getUpdateID(formData);
		const action = updateId ? 'update' : 'create';

		const isTagTeam = championship.tag;
		const isManualTeam = datas.currentTagType === 'manual';

		let upsertObject: UpsertObject = {
			Championship: { connect: { id: Number(datas.championshipId) } },
			won_date: datas.won_date ? new Date(datas.won_date as string) : new Date(),
			lost_date: datas.end_date ? new Date(datas.end_date as string) : null,
			victory_way: datas.victory_way,
			ppv_won: datas.ppv_won,
			current: datas.is_active
		};

		if (!isTagTeam) {
			if (!datas.wrestlerId)
				return Helpers.error('Debes seleccionar un luchador para un reinado individual', 400);

			upsertObject = {
				...upsertObject,
				Wrestler: { connect: { id: Number(datas.wrestlerId) } },
				Team: { disconnect: true },
				Partner: { disconnect: true }
			};
		}
		console.log({ upsertObject, isTagTeam, isManualTeam, action });

		return Helpers.error('No se ha implementado la acción de guardar el reinado aún.', 500);
		return Helpers.error('No se ha implementado la acción de guardar el reinado aún.', 500);
	}
};
