import { ChampionshipRepository } from "$lib/server/dao/repositories/championship.repository";
import { ReignsRepository } from "$lib/server/dao/repositories/reigns.repository.js";
import { WrestlerRepository } from "$lib/server/dao/repositories/wrestler.repository";
import { Helpers } from "$lib/server/server.helpers";
import type { ChampionshipReign } from "@prisma/client";

type Wrestler = {
	id: number;
	name: string;
	slug: string;
	image_name: string | null;
	brand: string;
	status: string;
	sex: 'm' | 'f';
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

		const wrestlerId = data.get('wrestler_id') as string | null;
		if (!wrestlerId || isNaN(Number(wrestlerId)))
			return Helpers.error('Wrestler inválido', 400);

		const gender = data.get('mitb_gender') as string | null;
		if (!gender || !['m', 'f'].includes(gender))
			return Helpers.error('Género inválido', 400);

		const championships = new ChampionshipRepository();
		const mitb = await championships.getRow({
			where: {
				type: 'mitb',
				gender: gender,
			},
		});

		// const reigns = new ReignsRepository();
		for (const [key, value] of data.entries()) {
			console.log(`${key}: ${value}`);
		}

		return Helpers.error('Not implemented', 500);
	}
};