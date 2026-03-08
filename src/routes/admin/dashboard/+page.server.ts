import { PPVDao } from '$lib/server/dao/ppv.dao';
import { MatchRepository } from '$lib/server/dao/repositories/match.repository';
import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository';
// import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';
import { RumbleRepository } from '$lib/server/dao/repositories/rumble.repository';

export const load = async () => {
	console.log('dashboard');
	const matches = new MatchRepository();
	const matchcards = new PpvCardRepository();
	const royalrumbles = new RumbleRepository();
	// const reigns = new ReignsRepository();

	// const averages = await matches.groupBy({
	// 	by: ['id_match_card'],
	// 	_avg: {
	// 		rating: true
	// 	},
	// 	where: {
	// 		rating: {
	// 			not: null
	// 		}
	// 	}
	// });
	const rumbles = await royalrumbles.getCurrentRumbles();
	// const currentReigns = await reigns.getCurrentReigns({
	// 	include: {
	// 		Championship: true,
	// 		Wrestler: true
	// 	}
	// });

	const ppvsWithoutRatings = await matches.getMatchesWithRatings({
		select: {
			id_match_card: true
		}
	});

	const ppvCardsWithoutRatings = await matchcards.get({
		where: {
			id: {
				in: ppvsWithoutRatings.map((m) => m.id_match_card)
			}
		}
	});

	return {
		rumbles,
		currentReigns: null,
		nextPpv: await PPVDao.getDashboardNextPPV(),
		missingRatings: ppvCardsWithoutRatings
	};
};
