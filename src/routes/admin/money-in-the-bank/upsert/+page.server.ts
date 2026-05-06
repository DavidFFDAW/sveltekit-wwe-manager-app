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
	sex: 'm' | 'f';
}

export const load = async ({ url }) => {
	const id = url.searchParams.get('id');
	const wrestlers = new WrestlerRepository();
	const championships = new ChampionshipRepository();
	const reigns = new ReignsRepository();

	const mitbs = await championships.get({
		select: { id: true, name: true, image: true, gender: true },
		where: {
			type: 'mitb'
		}
	});

	const elegibleWrestlers = await wrestlers.getNonReleasedWrestlers({
		select: { id: true, name: true, slug: true, sex: true, image_name: true },
		orderBy: {
			name: 'asc'
		}
	}) as Wrestler[];
	const genderWrestlers = elegibleWrestlers.reduce((acc, wrestler) => {
		if (wrestler.sex.toLowerCase() === 'm') {
			acc.male.push(wrestler);
		} else if (wrestler.sex.toLowerCase() === 'f') {
			acc.female.push(wrestler);
		}
		return acc;
	}, { male: [], female: [] } as { male: Wrestler[]; female: Wrestler[] });

	const currentReign = Boolean(id) ? (await reigns.getSingleById(Number(id))) : {} as ChampionshipReign;
	const isUpdate = Boolean(id) && currentReign?.id;

	return {
		upsert: {
			isUpdate,
			mitbs: mitbs,
			reign: currentReign,
			wrestlers: elegibleWrestlers,
			genderWrestlers
		}
	};
}
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		for (const [key, value] of data.entries()) {
			console.log(`${key}: ${value}`);
		}

		return Helpers.error('Not implemented', 500);
	}
};