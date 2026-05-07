import { Prisma, type Championship } from '@prisma/client';
import { Repository } from './Repository';

export class ChampionshipRepository extends Repository<
	Championship,
	Prisma.ChampionshipCreateInput,
	Prisma.ChampionshipUpdateInput,
	Prisma.ChampionshipWhereInput,
	Prisma.ChampionshipFindManyArgs,
	Prisma.ChampionshipGroupByArgs,
	Prisma.ChampionshipAggregateArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('championship');
	}

	getChampionshipsByMitbGender(gender: string) {
		return this.get({
			where: {
				type: { not: 'mitb' },
				gender: gender,
				tag: false,
			},
		});
	}
}
