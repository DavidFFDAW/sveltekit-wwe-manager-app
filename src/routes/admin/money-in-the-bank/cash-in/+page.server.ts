import { ChampionshipRepository } from "$lib/server/dao/repositories/championship.repository";
import { ReignsRepository } from "$lib/server/dao/repositories/reigns.repository";
import { Helpers } from "$lib/server/server.helpers.js";
import { Utils } from "$lib/utils/general.utils.js";

export const load = async ({ url }) => {
	const id = url.searchParams.get('mitb');
	const parentPage = url.pathname.split('/').slice(0, -1).join('/');
	if (!id || isNaN(Number(id))) return Helpers.redirection(parentPage);

	const reigns = new ReignsRepository();
	const championships = new ChampionshipRepository();

	const reign = await reigns.getBaseReign({
		id: Number(id),
		Championship: {
			type: 'mitb'
		}
	}) as any;

	const mitb = {
		id: reign.id,
		days: reign.days,
		won_date: reign.won_date,
		lost_date: reign.lost_date,
		date: Utils.formatDate(reign.won_date),
		wrestler: reign.Wrestler as { id: number, name: string, image_name: string },
		championship: reign.Championship as { id: number, name: string, image: string, gender: string },
	}

	const availableChampionships = await championships.get({
		select: {
			id: true,
			name: true,
			image: true,
		},
		where: {
			active: true,
			type: { not: 'mitb' },
			gender: mitb.championship.gender,
			tag: false,
		}
	});

	return {
		cashin: {
			mitb: mitb,
			canonical: parentPage,
			availableChampionships: availableChampionships,
		}
	};
}