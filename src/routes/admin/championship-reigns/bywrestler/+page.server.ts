import { Helpers } from '$lib/server/server.helpers';
import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';
import type { ChampionshipReign } from '@prisma/client';
import type { PaginationDatas } from '$lib/types/app.types.js';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { ReignUtils } from '$lib/utils/reign.utils.js';

const minimumWrestlerDatas = {
	id: true,
	name: true,
	slug: true,
	image_name: true
};

type ChampionshipReignWithRelations = ChampionshipReign & {
	Championship: {
		id: number;
		name: string;
		slug: string;
		image: string | null;
		tag: string | null;
	};
	Wrestler: typeof minimumWrestlerDatas;
	Partner: typeof minimumWrestlerDatas | null;
	Team: {
		id: number;
		name: string;
		slug: string;
	} | null;
};

export const load = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id || isNaN(Number(id))) return Helpers.redirection('/admin/championship-reigns');

	const reigns = new ReignsRepository();
	const wrestlers = new WrestlerRepository();
	const wrestler = await wrestlers.getSingleById(Number(id));
	if (!wrestler) return Helpers.redirection('/admin/championship-reigns');

	const { page, limit } = Helpers.getPaginationFromSearchParams(url.searchParams, 20);
	const { list, ...pagination } = (await reigns.paginateN(
		page,
		{
			include: {
				Championship: {
					select: {
						id: true,
						name: true,
						slug: true,
						image: true,
						tag: true
					}
				},
				Partner: {
					select: minimumWrestlerDatas
				},
				Team: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				}
			},
			where: {
				OR: [{ wrestler_id: Number(id) }, { partner: Number(id) }]
			}
		},
		limit
	)) as PaginationDatas<ChampionshipReignWithRelations>;

	if (list.length <= 0) return Helpers.redirection('/admin/championship-reigns');

	return {
		bywrestler: {
			wrestler,
			reigns: list.map((reign) => ({
				...reign,
				days_str: ReignUtils.getDaysAndMonths(reign.days)
			})),
			pagination
		}
	};
};
