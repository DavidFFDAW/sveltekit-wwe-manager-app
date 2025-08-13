import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';

export async function load({ params }) {
	const wrestlerSlug = params.wrestler;
	if (!wrestlerSlug || wrestlerSlug.length === 0) return Helpers.redirection('/roster');

	const repo = new WrestlerRepository();
	const wrestlerData = await repo.getRow({
		where: {
			slug: wrestlerSlug
		},
		include: {
			ChampionshipReign: {
				include: {
					Championship: true
				}
			}
		}
	});
	if (!wrestlerData || !wrestlerData.name) return Helpers.redirection('/roster');

	return {
		wrestler: wrestlerData
	};
}
