import { Prisma, type IaLog } from '@prisma/client';
import { Repository } from './Repository';

export class IaRepository extends Repository<
    IaLog,
    Prisma.IaLogCreateInput,
    Prisma.IaLogUpdateInput,
    Prisma.IaLogWhereInput,
    Prisma.IaLogFindManyArgs,
    Prisma.IaLogGroupByArgs,
    Prisma.IaLogAggregateArgs
> {
    protected requiredFields: string[] = [];

    constructor() {
        super('ia_log');
    }
}
