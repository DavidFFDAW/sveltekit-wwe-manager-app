import { PPVDao } from '$lib/server/dao/ppv.dao';
import { blog } from '$lib/server/dao/repositories/blog.repository';
import { matchcard } from '$lib/server/dao/repositories/matchcard.repository';
import { rumble } from '$lib/server/dao/repositories/rumble.repository';
// import { reigns } from '$lib/server/dao/repositories/reigns.repository';

export const load = async () => {

	const rumbles = await rumble.getCurrentRumbles();
	const drafts = await blog.getDrafts({
		select: {
			id: true,
			title: true,
			slug: true,
			image: true,
			exceptr: true
		}
	});

	const ppvCardsWithoutRatings = await matchcard.get({
		where: {
			matches: {
				some: { OR: [{ rating: null }, { winner: null }, { winner: '' }] }
			},
			ppv_date: { lt: new Date() }
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
