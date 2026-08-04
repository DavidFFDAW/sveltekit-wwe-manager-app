import { Prisma, type ChampionshipReign } from '@prisma/client';
import { Repository } from './Repository';
import { ReignUtils } from '$lib/utils/reign.utils';
import type { RankingChampionshipReign, RankingReign } from '$lib/types/app.types';

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
	getBasicCurrentReignForChampionship(championshipId: number) {
		return this.getRow({
			where: {
				current: true,
				lost_date: null,
				championship_id: championshipId,
			},
			orderBy: {
				won_date: 'desc',
			},
		});
	}


	async finishReign(id: number, reign: ChampionshipReign, lostDate: Date) {
		if (isNaN(id)) throw new Error('Invalid reign ID');
		if (!(lostDate instanceof Date) || isNaN(lostDate.getTime()))
			throw new Error('Invalid lost date');

		const real_days = ReignUtils.getDaysBetweenDates(reign.won_date, lostDate);
		return this.updateById(id, {
			lost_date: lostDate,
			days: real_days,
			current: false,
		});
	}

	async getRankingByWrestler(): Promise<RankingReign[]> {
		const list = await this.prisma.$queryRaw`SELECT
            COUNT(w.name) AS total_reigns,
            SUM(r.days) AS total_days, w.id AS wrestler_id, w.name, w.image_name AS wrestler_image
            FROM championship_reigns r 
            JOIN wrestler w 
            ON (r.wrestler_id = w.id OR r.partner = w.id) 
            JOIN championship c ON c.id = r.championship_id 
            WHERE r.can_stats_count = true
            GROUP BY w.id ORDER BY total_days DESC` as RankingReign[];

		return list.map((item) => ({
			name: item.name,
			total_reigns: Number(item.total_reigns),
			total_days: Number(item.total_days),
			wrestler_id: Number(item.wrestler_id),
			wrestler_image: item.wrestler_image,
		}));
	}

	async getRankingByChampionships(): Promise<RankingChampionshipReign[]> {
		const list = await this.prisma.$queryRaw`SELECT
            COUNT(c.name) AS times_won, 
            SUM(r.days) AS total_days, w.name, w.image_name AS wrestler_image, c.name AS championship_name, c.id AS championship_id, c.image AS championship_image
            FROM championship_reigns r 
            JOIN wrestler w 
            ON (r.wrestler_id = w.id OR r.partner = w.id)
            JOIN championship c 
            ON c.id = r.championship_id 
            WHERE r.can_stats_count = true
            GROUP BY c.id, w.id ORDER BY total_days DESC` as RankingChampionshipReign[];
		return list.map((item) => ({
			name: item.name,
			times_won: Number(item.times_won),
			total_days: Number(item.total_days),
			championship_id: Number(item.championship_id),
			wrestler_image: item.wrestler_image,
			championship_name: item.championship_name,
			championship_image: item.championship_image,
		}));
	}
}
