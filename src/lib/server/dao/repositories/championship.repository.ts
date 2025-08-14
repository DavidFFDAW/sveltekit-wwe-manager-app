import { Prisma, type Championship } from '@prisma/client';
import { Repository } from './Repository';

export class ChampionshipRepository extends Repository<
	Championship,
	Prisma.ChampionshipCreateInput,
	Prisma.ChampionshipUpdateInput,
	Prisma.ChampionshipWhereInput,
	Prisma.ChampionshipFindManyArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('championship');
	}
}
