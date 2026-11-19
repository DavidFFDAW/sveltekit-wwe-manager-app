import { Prisma, type PPV } from '@prisma/client';
import { Repository } from './Repository';

export class PPVRepository extends Repository<
	PPV,
	Prisma.PPVCreateInput,
	Prisma.PPVUpdateInput,
	Prisma.PPVWhereInput,
	Prisma.PPVFindManyArgs,
	Prisma.PPVGroupByArgs,
	Prisma.PPVAggregateArgs
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

	private readonly weekly: string[] = ['Raw', 'SmackDown', 'AWL', 'Evolution', 'Thursday Night Main Event'];

	constructor() {
		super('pPV');
	}

	getWeeklyShows(): string[] {
		return this.weeklyShows.map((show) => show.name);
	}

	getActiveNames() {
		return this.get({
			where: { active: true },
			select: { name: true },
			orderBy: { game_date: 'asc' }
		}).then((results) => [...this.weekly, ...results.map((r) => r.name)]);
	}

	updatePpvDate(id: number, newDate: Date | null): Promise<PPV> {
		return this.updateById(id, { game_date: newDate });
	}

	getAnnualOrder(gameDate: Date): number {
		const month = gameDate.getMonth() + 1;
		return month * 100 + gameDate.getDate();
	}

	async updatePastPpvDates(): Promise<number> {
		const now = new Date();
		const nextYear = now.getUTCFullYear() + 1;

		const ppvs = await this.get({
			select: { id: true, name: true, game_date: true },
			where: { active: true, game_date: { lt: now, not: null } }
		});
		const updatePromises: Promise<PPV>[] = ppvs.map((ppv) => {
			const ppvDate = new Date(ppv.game_date!);
			ppvDate.setFullYear(nextYear);
			const day = ppvDate.getDay();
			const diff = day <= 3 ? -day : 7 - day;
			if (ppvDate.getDay() !== 0) ppvDate.setDate(ppvDate.getDate() + diff);
			ppvDate.setUTCHours(21, 0, 0);

			console.log(`Update ppv ${ppv.name} to ${ppvDate.getCustomIsoFormat()}`);

			return this.update(
				{ id: ppv.id },
				{ game_date: ppvDate }
			)
		});

		const result = await Promise.all(updatePromises);
		return result.length;
	}
}

export const ppv = new PPVRepository();
