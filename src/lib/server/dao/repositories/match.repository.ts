import { Prisma, type Match } from '@prisma/client';
import { Repository } from './Repository';

export class MatchRepository extends Repository<
	Match,
	Prisma.MatchCreateInput,
	Prisma.MatchUpdateInput,
	Prisma.MatchWhereInput,
	Prisma.MatchFindManyArgs,
	Prisma.MatchGroupByArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('match');
	}

	public getMatchesWithRatings({ select }: { select?: Prisma.MatchSelect } = {}) {
		return this.get({
			distinct: ['id_match_card'],
			where: {
				rating: null
			},
			select
		});
	}
}
