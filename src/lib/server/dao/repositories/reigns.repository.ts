import { Prisma, type ChampionshipReign } from '@prisma/client';
import { Repository } from './Repository';

export class ReignsRepository extends Repository<
	ChampionshipReign,
	Prisma.ChampionshipReignCreateInput,
	Prisma.ChampionshipReignUpdateInput,
	Prisma.ChampionshipReignWhereInput,
	Prisma.ChampionshipReignFindManyArgs,
	Prisma.ChampionshipReignGroupByArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('championshipReign');
	}

	getCurrentReigns({ include }: { include?: Prisma.ChampionshipReignInclude } = {}) {
		return this.get({
			where: {
				current: true,
				lost_date: null
			},
			include,
			orderBy: {
				won_date: 'asc'
			}
		});
	}
}
