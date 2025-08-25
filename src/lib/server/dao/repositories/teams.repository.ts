import { Prisma, type Team } from '@prisma/client';
import { Repository } from './Repository';

export class TeamsRepository extends Repository<
	Team,
	Prisma.TeamCreateInput,
	Prisma.TeamUpdateInput,
	Prisma.TeamWhereInput,
	Prisma.TeamFindManyArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('team');
	}

	public getTeamsWithMembers(args?: Prisma.TeamFindManyArgs) {
		return this.prisma.team.findMany({
			...args,
			include: {
				WrestlerTeam: {
					include: {
						Wrestler: true
					}
				}
			}
		});
	}
}
