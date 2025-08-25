import { Prisma, type Rivalries } from '@prisma/client';
import { Repository } from './Repository';

export class RivalriesRepository extends Repository<
	Rivalries,
	Prisma.RivalriesCreateInput,
	Prisma.RivalriesUpdateInput,
	Prisma.RivalriesWhereInput,
	Prisma.RivalriesFindManyArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('rivalries');
	}
}
