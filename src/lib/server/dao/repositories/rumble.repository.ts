import { Prisma, type Rumble } from '@prisma/client';
import { Repository } from './Repository';

export class RumbleRepository extends Repository<
    Rumble,
    Prisma.RumbleCreateInput,
    Prisma.RumbleUpdateInput,
    Prisma.RumbleWhereInput,
    Prisma.RumbleFindManyArgs
> {
    protected requiredFields: string[] = [];

    constructor() {
        super('rumble');
    }
}
