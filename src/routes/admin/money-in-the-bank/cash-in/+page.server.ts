import { Utils } from "$lib/utils/general.utils.js";
import { Helpers } from "$lib/server/server.helpers.js";
import { ReignsRepository } from "$lib/server/dao/repositories/reigns.repository";
import { PPVRepository } from "$lib/server/dao/repositories/ppv.repository.js";

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
		cashin: {
			canonical: parentPage,
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
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const championship = Number(formData.get('championship_id') as string);
		console.log({ championship });

		if (isNaN(championship)) return Helpers.error('Invalid championship selected.', 400);

		try {
			const reigns = new ReignsRepository();
			const currentReign = await reigns.getCurrentReignForChampionship(championship);
			console.log({ championship, currentReign });

			if (!currentReign.id) return Helpers.error('No current reign found for the selected championship.', 404);

			// await reigns.finishReign(currentReign.id, currentReign, new Date());

		} catch (error) {
			console.log('Error processing cash-in:', error);
			return Helpers.error('An error occurred while processing the cash-in. Please try again.', 500);
		}
	}
};