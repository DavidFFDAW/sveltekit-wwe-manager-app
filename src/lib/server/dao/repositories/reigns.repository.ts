import { Prisma, type ChampionshipReign } from '@prisma/client';
import { Repository } from './Repository';
import { ReignUtils } from '$lib/utils/reign.utils';

export class ReignsRepository extends Repository<
	ChampionshipReign,
	Prisma.ChampionshipReignCreateInput,
	Prisma.ChampionshipReignUpdateInput,
	Prisma.ChampionshipReignWhereInput,
	Prisma.ChampionshipReignFindManyArgs,
	Prisma.ChampionshipReignGroupByArgs,
	Prisma.ChampionshipReignAggregateArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('championshipReign');
	}

	getBaseReign(where: Prisma.ChampionshipReignWhereInput) {
		return this.getRow({
			select: {
				Wrestler: {
					select: {
						id: true,
						name: true,
						image_name: true
					}
				},
				Championship: {
					select: {
						id: true,
						name: true,
						image: true,
						gender: true,
						type: true,
					}
				},
				id: true,
				won_date: true,
				lost_date: true
			},
			where
		});
	}

	getCurrentReigns({ include }: { include?: Prisma.ChampionshipReignInclude } = {}) {
		return this.get({
			where: {
				current: true,
				lost_date: null,
			},
			include,
			orderBy: {
				won_date: 'asc',
			},
		});
	}

	getGroupedReignsWithCount(
		by: Array<keyof ChampionshipReign>,
		args: Omit<Prisma.ChampionshipReignGroupByArgs, 'by'>,
	): Promise<Prisma.ChampionshipReignGroupByOutputType[]> {
		const fields: Prisma.ChampionshipReignGroupByArgs = {
			by,
			_count: {
				championship_id: true,
			},
			_sum: {
				days: true,
			},
			orderBy: {
				_count: {
					championship_id: 'desc',
				},
			},
			...args,
		};
		return this.groupBy(fields);
	}

	getCurrentReignForChampionship(championshipId: number) {
		return this.getRow({
			where: {
				current: true,
				lost_date: null,
				championship_id: championshipId,
			},
			include: {
				Wrestler: true,
				Championship: true,
			},
			orderBy: {
				won_date: 'desc',
			},
		});
	}

	async finishReign(id: number, reign: ChampionshipReign, lostDate: Date) {
		if (isNaN(id)) throw new Error('Invalid reign ID');
		if (!(lostDate instanceof Date) || isNaN(lostDate.getTime())) throw new Error('Invalid lost date');

		const real_days = ReignUtils.getDaysBetweenDates(reign.won_date, lostDate);
		return this.updateById(id, {
			lost_date: lostDate,
			days: real_days,
			current: false,
		});
	}
}
