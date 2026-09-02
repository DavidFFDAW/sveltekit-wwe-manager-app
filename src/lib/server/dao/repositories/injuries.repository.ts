import { Prisma, type Injuries } from '@prisma/client';
import { Repository } from './Repository';

export class InjuriesRepository extends Repository<
	Injuries,
	Prisma.InjuriesCreateInput,
	Prisma.InjuriesUpdateInput,
	Prisma.InjuriesWhereInput,
	Prisma.InjuriesFindManyArgs,
	Prisma.InjuriesGroupByArgs,
	Prisma.InjuriesAggregateArgs
> {
	protected requiredFields: string[] = [
		'wrestler_id',
		'injury',
		'severity',
		'start_date',
		'end_date',
	];

	constructor() {
		super('injuries');
	}
}
