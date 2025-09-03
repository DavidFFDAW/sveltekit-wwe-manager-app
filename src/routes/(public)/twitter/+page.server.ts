import { TwitterRepository } from '$lib/server/dao/repositories/twitter.repository.js';

export const load = async () => {
	const twitterRepo = new TwitterRepository();
	const tweets = await twitterRepo.get({
		include: {
			replies: true,
			reply_to_tweet: true
		}
	});

	return { tweets };
};
