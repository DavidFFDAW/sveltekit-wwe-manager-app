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

	public getAverageRating() {
		return this.groupBy({
			by: ['id_match_card'],
			_avg: {
				rating: true
			},
			where: {
				rating: {
					not: null
				}
			}
		});
	}
}
