import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { TwitterRepository } from '$lib/server/dao/repositories/twitter.repository';
import { Utils } from '$lib/utils/general.utils';

export const load = async () => {
	const wrestlerRepository = new WrestlerRepository();
	const twitterRepository = new TwitterRepository();

	const twitter_images = await wrestlerRepository.get({
		select: {
			id: true,
			name: true,
			twitter_image: true
		},
		orderBy: {
			name: 'asc'
		}
	});
	const existingImages = twitter_images.filter((wrestler) => wrestler.twitter_image);

	return {
		wrestler_images: existingImages,
		tweets: await twitterRepository.get(),
		likes: Utils.getRandomNumberBetween(5000, 50_000),
		retweets: Utils.getRandomNumberBetween(5000, 10_000)
	};
};
