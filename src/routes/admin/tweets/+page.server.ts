import { TwitterRepository } from '$lib/server/dao/repositories/twitter.repository';

export const load = async () => {
	const twitterRepository = new TwitterRepository();
	const tweets = await twitterRepository.get({
		orderBy: {
			created_at: 'desc'
		}
	});

	return {
		tweets
		// wrestler_images: existingImages,
		// likes: getRandomNumberBetween(5000, 50_000),
		// retweets: getRandomNumberBetween(1000, 10_000)
	};
};
