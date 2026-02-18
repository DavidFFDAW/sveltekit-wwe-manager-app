import { Prisma, type Tweets } from '@prisma/client';
import { Repository } from './Repository';

export class TwitterRepository extends Repository<
	Tweets,
	Prisma.TweetsCreateInput,
	Prisma.TweetsUpdateInput,
	Prisma.TweetsWhereInput,
	Prisma.TweetsFindManyArgs,
	Prisma.TweetsGroupByArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('tweets');
	}
}
