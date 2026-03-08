import { Prisma, type Rumble } from '@prisma/client';
import { Repository } from './Repository';

export class RumbleRepository extends Repository<
	Rumble,
	Prisma.RumbleCreateInput,
	Prisma.RumbleUpdateInput,
	Prisma.RumbleWhereInput,
	Prisma.RumbleFindManyArgs,
	Prisma.RumbleGroupByArgs
> {
	protected requiredFields: string[] = ['year', 'entry_number', 'winner_id'];

	constructor() {
		super('rumble');
	}

	getCurrentRumbles(year: number = new Date().getFullYear()) {
		return this.get({
			orderBy: {
				year: 'desc'
			},
			where: {
				year: year.toString()
			},
			take: 2
		});
	}
}
