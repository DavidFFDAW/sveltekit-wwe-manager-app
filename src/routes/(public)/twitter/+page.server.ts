import { twitter } from '$lib/server/dao/repositories/twitter.repository.js';

export const load = async () => {

	const tweets = await twitter.get({
		include: {
			replies: true,
			reply_to_tweet: true
		}
	});

	return { tweets };
};
