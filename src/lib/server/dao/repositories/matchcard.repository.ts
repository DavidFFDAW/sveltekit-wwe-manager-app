import { Prisma, type Match, type PPVCard } from '@prisma/client';
import { Repository } from './Repository';
import { MatchRepository } from './match.repository';

export class PpvCardRepository extends Repository<
	PPVCard,
	Prisma.PPVCardCreateInput,
	Prisma.PPVCardUpdateInput,
	Prisma.PPVCardWhereInput,
	Prisma.PPVCardFindManyArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('PPVCard');
	}

	getMatchesRepository() {
		return new MatchRepository();
	}

	getMatchCardWithMatches(slug: string, args: Prisma.PPVCardFindManyArgs = {}) {
		args.include = {
			...args.include,
			matches: true
		};
		args.where = {
			...args.where,
			id: Number(slug)
		};

		return this.getRow(args) as Promise<PPVCard & { matches: Match[] }>;
	}
}
