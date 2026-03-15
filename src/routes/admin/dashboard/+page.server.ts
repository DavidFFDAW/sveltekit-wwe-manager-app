import { PPVDao } from '$lib/server/dao/ppv.dao';
import { BlogRepository } from '$lib/server/dao/repositories/blog.repository';
import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository';
import { RumbleRepository } from '$lib/server/dao/repositories/rumble.repository';
// import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';

export const load = async () => {
	const blog = new BlogRepository();
	const matchcards = new PpvCardRepository();
	const royalrumbles = new RumbleRepository();

	const rumbles = await royalrumbles.getCurrentRumbles();
	const drafts = await blog.getDrafts({
		select: {
			id: true,
			title: true,
			slug: true,
			image: true,
			exceptr: true
		}
	});

	const ppvCardsWithoutRatings = await matchcards.get({
		where: {
			matches: {
				some: { OR: [{ rating: null }, { winner: null }, { winner: '' }] }
			},
			ppv_date: { lte: new Date() }
		}
	});

	return {
		dashboard: {
			drafts,
			rumbles,
			currentReigns: null,
			nextPpv: await PPVDao.getDashboardNextPPV(),
			missingRatings: ppvCardsWithoutRatings
		}
	};
};
