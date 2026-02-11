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
	private readonly weeklyShows: string[] = ['Raw', 'SmackDown', 'AWL', 'Thursday Night Main Event'];

	constructor() {
		super('pPV');
	}

	getWeeklyShows(): string[] {
		return this.weeklyShows;
	}

	getActiveNames(): Promise<string[]> {
		return this.prisma.pPV
			.findMany({
				where: { active: true },
				select: { name: true }
			})
			.then((results) => [...this.getWeeklyShows(), ...results.map((r) => r.name)]);
	}

	updatePpvDate(id: number, newDate: Date | null): Promise<PPV> {
		return this.updateById(id, { game_date: newDate });
	}
}
