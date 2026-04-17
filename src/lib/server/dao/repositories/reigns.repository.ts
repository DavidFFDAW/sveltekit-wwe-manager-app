import { Prisma, type ChampionshipReign } from '@prisma/client';
import { Repository } from './Repository';

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
}
