import { Prisma, type Analytics } from '@prisma/client';
import { Repository } from './Repository';

export class AnalyticsRepository extends Repository<
	Analytics,
	Prisma.AnalyticsCreateInput,
	Prisma.AnalyticsUpdateInput,
	Prisma.AnalyticsWhereInput,
	Prisma.AnalyticsFindManyArgs,
	Prisma.AnalyticsGroupByArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('analytics');
	}
}
