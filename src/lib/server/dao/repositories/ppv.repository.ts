import { Prisma, type PPV } from '@prisma/client';
import { Repository } from './Repository';

export class PPVRepository extends Repository<
    PPV,
    Prisma.PPVCreateInput,
    Prisma.PPVUpdateInput,
    Prisma.PPVWhereInput,
    Prisma.PPVFindManyArgs
> {
    protected requiredFields: string[] = [];

    constructor() {
        super('pPV');
    }
}
