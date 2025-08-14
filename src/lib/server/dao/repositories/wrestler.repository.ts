import { Prisma, type Wrestler } from '@prisma/client';
import { Repository } from './Repository';

export class WrestlerRepository extends Repository<
	Wrestler,
	Prisma.WrestlerCreateInput,
	Prisma.WrestlerUpdateInput,
	Prisma.WrestlerWhereInput,
	Prisma.WrestlerFindManyArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('wrestler');
	}

	getNonReleasedWrestlers(args: Prisma.WrestlerFindManyArgs = {}) {
		args.where = {
			status: { notIn: ['released'] },
			...args.where
		};

		return this.get(args);
	}
}
