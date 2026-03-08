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

	getCurrentReigns() {
		return this.get({
			where: {
				current: true,
				lost_date: null
			},
			orderBy: {
				won_date: 'asc'
			}
		});
	}
}
