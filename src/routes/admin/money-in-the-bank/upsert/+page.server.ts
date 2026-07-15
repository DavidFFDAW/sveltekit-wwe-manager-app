import { ChampionshipRepository } from "$lib/server/dao/repositories/championship.repository";
import { ReignsRepository } from "$lib/server/dao/repositories/reigns.repository.js";
import { WrestlerRepository } from "$lib/server/dao/repositories/wrestler.repository";
import { Helpers } from "$lib/server/server.helpers";
import { DateUtils } from "$lib/utils/date.utils";
import type { ChampionshipReign } from "@prisma/client";

type Wrestler = {
	id: number;
	name: string;
	slug: string;
	image_name: string | null;
	brand: string;
	status: string;
	sex: 'M' | 'F';
}

export const load = async ({ url }) => {
	const id = url.searchParams.get('id');
	const wrestlers = new WrestlerRepository();
	const reigns = new ReignsRepository();

	const wrestlersList = await wrestlers.get({
		select: { id: true, name: true, slug: true, sex: true, image_name: true, brand: true, status: true },
		where: {
			status: { not: { in: ['released', 'injured'] } }
		},
		orderBy: {
			name: 'asc'
		}
	}) as Wrestler[];

	const currentReign = Boolean(id) ? (await reigns.getSingleById(Number(id))) : {} as ChampionshipReign;
	const isUpdate = Boolean(id) && currentReign?.id;

	const upsertDatas = {
		id: currentReign?.id || 0,
		date: currentReign?.won_date || (new Date()).toISOString().split('T')[0],
		wrestler_id: currentReign?.wrestler_id || 0,
		ppv: currentReign?.ppv_won || 'Money in the Bank',
		match: currentReign?.victory_way || 'Ladder match',
	}

	return {
		upsert: {
			isUpdate,
			upsertDatas,
			wrestlers: wrestlersList,
			wrestlersMap: new Map(wrestlersList.map((wrestler) => [wrestler.id, wrestler])),
		},
		metas: {
			title: isUpdate ? 'Editar MITB' : 'Nuevo MITB',
		}
	}
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const updateId = Helpers.getUpdateID(data);
		const ppvWon = data.get('ppv') as string | null || 'Money in the Bank';
		const wonTimestamp = data.get('won_date') as string | null;
		const wonDate = DateUtils.getDateInstanceTimezone(new Date(wonTimestamp || ''), 'Europe/Madrid')
		wonDate.setHours(0, 0, 0, 0);

		console.log({
			updateId,
			wonTimestamp,
			wonDate,
			ppvWon,
		});

		const wrestlerId = data.get('wrestler_id') as string | null;
		if (!wrestlerId || isNaN(Number(wrestlerId)))
			return Helpers.error('Wrestler inválido', 400);

		try {
			const wrestlers = new WrestlerRepository();
			const wrestler = await wrestlers.getSingleById(Number(wrestlerId));
			if (!wrestler)
				return Helpers.error('Wrestler no encontrado', 404);

			const gender = wrestler.sex.toLowerCase().trim();
			console.log('wrestler gender', gender);
			if (!gender || !['m', 'f'].includes(gender))
				return Helpers.error('Género inválido', 400);

			const championships = new ChampionshipRepository();
			const mitb = await championships.getRow({
				where: {
					type: 'mitb',
					gender: gender,
				},
			});
			if (!mitb)
				return Helpers.error('MITB Championship no encontrado', 404);

			const reigns = new ReignsRepository();
			const currentMitbReign = await reigns.getRow({
				where: {
					championship_id: mitb.id,
					lost_date: null,
					current: true,
				}
			})

			if (currentMitbReign && !updateId) {
				await reigns.finishReign(currentMitbReign.id, currentMitbReign, wonDate);
			}

			console.log({
				updateId,
				currentMitbReign,
				wrestler,
				mitb,
			});

			const today = new Date();
			const calculatedDays = DateUtils.getDaysBetweenDates(wonDate, today);
			console.log('calculatedDays', calculatedDays);

			await reigns.upsert({
				Wrestler: {
					connect: { id: Number(wrestlerId) }
				},
				Championship: {
					connect: { id: mitb.id }
				},
				ppv_won: ppvWon,
				victory_way: "Ladder match",
				won_date: wonDate,
				current: currentMitbReign ? currentMitbReign.current : true,
				days: calculatedDays,
			}, updateId);
		} catch (error) {
			console.error('Error updating reign:', error);
			return Helpers.error('Error al actualizar el reinado', 500);
		}
	}
};