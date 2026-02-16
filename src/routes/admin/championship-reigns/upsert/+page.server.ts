import { ChampionshipRepository } from '$lib/server/dao/repositories/championship.repository.js';
import { PPVRepository } from '$lib/server/dao/repositories/ppv.repository.js';
import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';
import { TeamsRepository } from '$lib/server/dao/repositories/teams.repository';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';
import { Helpers } from '$lib/server/server.helpers.js';
import { ReignUtils } from '$lib/utils/reign.utils.js';
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

		try {
			const championshipId = Number(formData.get('championship_id'));
			if (isNaN(championshipId))
				return Helpers.error('El ID del campeonato debe ser un número', 400);

			const reignsRepo = new ReignsRepository();
			const chpRepo = new ChampionshipRepository();
			const championship = await chpRepo.getSingleById(championshipId);
			if (!championship) return Helpers.error('El campeonato seleccionado no existe', 400);

			const datas = {
				championshipId: championshipId,
				type: formData.get('tag_type'),
				currentTagType: formData.get('current_tag_type'),
				end_date: formData.get('end_date') ? new Date(formData.get('end_date') as string) : null,
				won_date: formData.get('start_date')
					? new Date(formData.get('start_date') as string)
					: new Date(),
				is_active: formData.get('end_date') ? false : true,
				wrestlerId: formData.get('wrestler_id'),
				teamId: formData.get('team_id') ? Number(formData.get('team_id')) : null,
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
			const calculatedDays = ReignUtils.getDaysBetweenDates(
				datas.won_date,
				datas.end_date ? datas.end_date : new Date()
			);

			let upsertObject: UpsertObject = {
				Championship: { connect: { id: Number(datas.championshipId) } },
				won_date: datas.won_date as Date,
				lost_date: datas.end_date as Date | null,
				victory_way: datas.victory_way,
				ppv_won: datas.ppv_won,
				current: datas.is_active,
				days: calculatedDays
			};

			if (!isTagTeam) {
				if (!datas.wrestlerId)
					return Helpers.error('Debes seleccionar un luchador para un reinado individual', 400);

				upsertObject = {
					...upsertObject,
					Wrestler: { connect: { id: Number(datas.wrestlerId) } }
				};
				if (action === 'update') {
					upsertObject.Team = { disconnect: true };
					upsertObject.Partner = { disconnect: true };
				}
			}
			if (isTagTeam) {
				const teamId = isManualTeam ? null : datas.teamId;
				if (!isManualTeam && !teamId)
					return Helpers.error('Debes seleccionar un equipo para un reinado de equipo', 400);

				upsertObject = {
					...upsertObject,
					Wrestler: { connect: { id: datas.members[0] } },
					Partner: { connect: { id: datas.members[1] } },
					Team: teamId
						? { connect: { id: teamId } }
						: action === 'update'
							? { disconnect: true }
							: undefined
				};
			}

			if (datas.is_active) {
				const activeReign = await reignsRepo.getRow({
					where: {
						championship_id: datas.championshipId,
						current: true,
						NOT: {
							id: updateId ? Number(updateId) : undefined
						}
					},
					orderBy: { won_date: 'desc' },
					take: 1
				});

				if (activeReign) {
					const updatedOldReignDays = ReignUtils.getDaysBetweenDates(
						activeReign?.won_date,
						datas.won_date
					);
					console.log({
						activeReign,
						newOldDate: datas.won_date,
						updatedOldReignDays
					});

					await reignsRepo.updateById(activeReign.id, {
						current: false,
						lost_date: datas.won_date as Date,
						days: updatedOldReignDays
						// ppv_lost: datas.ppv_won ? datas.ppv_won : null
					});
				}
			}

			const upsertAction =
				action === 'create'
					? () => reignsRepo.create(upsertObject as Prisma.ChampionshipReignCreateInput)
					: () =>
							reignsRepo.updateById(
								Number(updateId),
								upsertObject as Prisma.ChampionshipReignUpdateInput
							);

			await upsertAction();
			console.log({ ...upsertObject, isTagTeam, isManualTeam, action });
			return Helpers.success(
				`Reinado ${action === 'create' ? 'creado' : 'actualizado'} correctamente`
			);
		} catch (error) {
			console.error('Error al guardar el reinado:', error);
			return Helpers.error('No se ha implementado la acción de guardar el reinado aún.', 500);
		}
	}
};
