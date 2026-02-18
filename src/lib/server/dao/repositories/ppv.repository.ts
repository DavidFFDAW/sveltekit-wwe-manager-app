import { Prisma, type PPV } from '@prisma/client';
import { Repository } from './Repository';

export class PPVRepository extends Repository<
	PPV,
	Prisma.PPVCreateInput,
	Prisma.PPVUpdateInput,
	Prisma.PPVWhereInput,
	Prisma.PPVFindManyArgs,
	Prisma.PPVGroupByArgs
> {
	protected requiredFields: string[] = [];
	private readonly weeklyShows: { name: string; image: string | null }[] = [
		{
			name: 'Raw',
			image: '/brands/raw.webp'
		},
		{
			name: 'SmackDown',
			image: '/brands/smackdown.webp'
		},
		{
			name: 'AWL',
			image: '/brands/awl.webp'
		},
		{
			name: 'Thursday Night Main Event',
			image: '/brands/tnme.webp'
		}
	];

	constructor() {
		super('pPV');
	}

	getWeeklyShows(): string[] {
		return this.weeklyShows.map((show) => show.name);
	}

	getActiveNames() {
		return this.prisma.pPV
			.findMany({
				where: { active: true },
				select: { name: true },
				orderBy: { game_date: 'asc' }
			})
			.then((results) => [...this.getWeeklyShows(), ...results.map((r) => r.name)]);
	}

	updatePpvDate(id: number, newDate: Date | null): Promise<PPV> {
		return this.updateById(id, { game_date: newDate });
	}
}
