import { Prisma, type Match } from '@prisma/client';
import { Repository } from './Repository';

export class MatchRepository extends Repository<
	Match,
	Prisma.MatchCreateInput,
	Prisma.MatchUpdateInput,
	Prisma.MatchWhereInput,
	Prisma.MatchFindManyArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('match');
	}
}
