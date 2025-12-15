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
		super('pPVCard');
	}

	getMatchesRepository() {
		return new MatchRepository();
	}

	async getUniquePpvYears() {
		const ppvDates = await this.get({
			select: {
				ppv_date: true
			},
			distinct: ['ppv_date'],
			where: {
				ppv_date: {
					not: null
				}
			},
			orderBy: {
				ppv_date: 'asc'
			}
		});

		return Array.from(new Set(ppvDates.map((ppv) => ppv.ppv_date!.getFullYear())));
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
