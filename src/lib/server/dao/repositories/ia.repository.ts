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
        super('iaLog');
	}
	
	register(data: Prisma.IaLogCreateInput) {
		return this.create({
			...data,
			model: data.model.slice(0, 20),
			request_id: data.request_id.length > 255 ? data.request_id.slice(0, 255) : data.request_id,
			total_time: data.total_time > 0 ? Number(data.total_time.toFixed(2)) : 0,
			total_tokens: Number(data.total_tokens)
		});
	}
}
