import { Prisma, type ChampionshipReign } from '@prisma/client';
import { Repository } from './Repository';

export class ReignsRepository extends Repository<
	ChampionshipReign,
	Prisma.ChampionshipReignCreateInput,
	Prisma.ChampionshipReignUpdateInput,
	Prisma.ChampionshipReignWhereInput,
	Prisma.ChampionshipReignFindManyArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('championshipReign');
	}
}
