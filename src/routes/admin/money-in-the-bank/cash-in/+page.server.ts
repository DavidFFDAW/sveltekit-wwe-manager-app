import { Utils } from "$lib/utils/general.utils.js";
import { Helpers } from "$lib/server/server.helpers.js";
import { ReignsRepository } from "$lib/server/dao/repositories/reigns.repository";
import { PPVRepository } from "$lib/server/dao/repositories/ppv.repository.js";
import type { Prisma } from "@prisma/client";
import { ReignUtils } from "$lib/utils/reign.utils.js";

export const load = async ({ url }) => {
	const id = url.searchParams.get('mitb');
	const parentPage = url.pathname.split('/').slice(0, -1).join('/');
	if (!id || isNaN(Number(id))) return Helpers.redirection(parentPage);

	const ppvs = new PPVRepository();
	const reigns = new ReignsRepository();

	const reign = await reigns.getBaseReign({
		id: Number(id),
		Championship: {
			type: 'mitb'
		}
	}) as any;
	if (reign.lost_date) return Helpers.redirection(parentPage);

	const availableChampionships = await reigns.get({
		select: {
			won_date: true,
			Wrestler: {
				select: { id: true, name: true, image_name: true }
			},
			Championship: {
				select: { id: true, name: true, image: true, gender: true }
			},
		},
		where: {
			Championship: {
				tag: false,
				type: { not: 'mitb' },
				gender: reign.Championship.gender.toLowerCase(),
			},
			can_stats_count: true,
			lost_date: null,
			current: true,
		}
	}) as any[];

	return {
		metas: {
			title: 'Canjeo de MITB',
		},
		cashin: {
			today: (new Date()).toISOString().split('T')[0],
			canonical: parentPage,
			parentPage,
			mitb: {
				id: reign.id,
				days: reign.days,
				won_date: reign.won_date,
				lost_date: reign.lost_date,
				date: Utils.formatDate(reign.won_date),
				wrestler: reign.Wrestler as { id: number, name: string, image_name: string },
				championship: reign.Championship as { id: number, name: string, image: string, gender: string },
			},
			availableChampionships: availableChampionships.map(c => ({
				won_date: c.won_date,
				date: Utils.formatDate(c.won_date),
				wrestler: c.Wrestler as { id: number, name: string, image_name: string },
				championship: c.Championship as { id: number, name: string, image: string, gender: string },
			})),
			ppvs: await ppvs.getActiveNames(),
		}
	};
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		try {
			Helpers.checkRequiredFieldsThrow(
				formData,
				['mitb_id', 'wrestler_id', 'championship_id', 'cashin_date', 'ppv_won']
			);

			const datas = {
				championship: Number(formData.get('championship_id') as string),
				cashinDate: formData.get('cashin_date') as string,
				ppvWon: formData.get('ppv_won') as string,
				mitbId: Number(formData.get('mitb_id') as string),
				wrestlerId: Number(formData.get('wrestler_id') as string),
			};
			console.log({ datas });

			if (isNaN(datas.championship)) return Helpers.error('Invalid championship selected.', 400);

			const reigns = new ReignsRepository();
			const previousChampionshipReign = await reigns.getBasicCurrentReignForChampionship(datas.championship);
			const currentMitbReign = await reigns.getSingleById(datas.mitbId);
			console.log({ previousChampionshipReign, currentMitbReign });


			if (!currentMitbReign || !currentMitbReign.id) return Helpers.error('No current reign found for the selected MITB.', 404);
			if (!previousChampionshipReign.id) return Helpers.error('No current reign found for the selected championship.', 404);

			const today = new Date();
			const cashedDate = new Date(datas.cashinDate);
			if (cashedDate > today) return Helpers.error('La fecha de canjeo no puede ser futura a hoy.', 400);
			const newCreateDays = ReignUtils.getDaysBetweenDates(cashedDate, today);

			await reigns.finishReign(currentMitbReign.id, currentMitbReign, cashedDate);
			await reigns.finishReign(previousChampionshipReign.id, previousChampionshipReign, cashedDate);

			const newChampionshipReign: Prisma.ChampionshipReignCreateInput = {
				days: newCreateDays,
				won_date: cashedDate,
				current: true,
				ppv_won: datas.ppvWon,
				Wrestler: {
					connect: { id: datas.wrestlerId }
				},
				Championship: {
					connect: { id: datas.championship }
				},
				victory_way: 'Canjeo',
			};
			await reigns.create(newChampionshipReign);
			return Helpers.success('MITB canjeado exitosamente.', 200);
		} catch (error) {
			console.log('Error processing cash-in:', error);
			const message = error instanceof Error ? error.message : String(error);
			return Helpers.error(`Error: ${message}.`, 500);
		}
	}
};