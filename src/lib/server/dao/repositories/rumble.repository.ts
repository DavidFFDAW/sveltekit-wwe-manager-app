import { Prisma, type Rumble } from '@prisma/client';
import { Repository } from './Repository';
import prisma from '$lib/server/prisma';

export class RumbleRepository extends Repository<
	Rumble,
	Prisma.RumbleCreateInput,
	Prisma.RumbleUpdateInput,
	Prisma.RumbleWhereInput,
	Prisma.RumbleFindManyArgs,
	Prisma.RumbleGroupByArgs,
	Prisma.RumbleAggregateArgs
> {
	private _model = prisma.rumble;
	protected requiredFields: string[] = ['year', 'entry_number', 'winner_id'];

	constructor() {
		super('rumble');
	}

	getCurrentRumbles(year: number = new Date().getFullYear()) {
		return this.get({
			select: {
				id: true,
				winner: {
					select: {
						id: true,
						name: true,
						image_name: true
					}
				},
				year: true,
				entry_number: true,
				successful: true
			},
			where: {
				year: year.toString()
			},
			orderBy: {
				year: 'desc'
			},
			take: 2
		});
	}
}

export const rumble = new RumbleRepository();