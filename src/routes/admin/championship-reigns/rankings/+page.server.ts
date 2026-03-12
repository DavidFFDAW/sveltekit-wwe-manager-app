import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';
import { ReignUtils } from '$lib/utils/reign.utils';

export const load = async () => {
	const reigns = new ReignsRepository();
	const wrestlers = new WrestlerRepository();

	const aggregation = await reigns.groupBy({
		by: ['wrestler_id'],
		_count: {
			championship_id: true
		},
		_sum: {
			days: true
		},
		having: {
			championship_id: {
				_count: {
					gt: 1
				}
			}
		},
		orderBy: {
			_count: {
				championship_id: 'desc'
			}
		}
	});

	const wrestlerIds = aggregation
		.map((item: any) => [item.wrestler_id, item.partner])
		.flat()
		.filter(Boolean);

	const wrestlerDatas = await wrestlers.get({
		select: {
			id: true,
			name: true,
			slug: true,
			image_name: true
		},
		where: {
			id: {
				in: wrestlerIds
			}
		}
	});
	const wrestlersMap = new Map(wrestlerDatas.map((w) => [w.id, w]));
	console.log({ wrestlerIds, wrestlerDatas, wrestlersMap });

	const list = aggregation.map((item: any) => {
		const wrestler = wrestlersMap.get(item.wrestler_id);
		const partner = item.partner ? wrestlersMap.get(item.partner) : null;
		return {
			wrestler,
			partner,
			times_champion: item._count.championship_id,
			days_str: ReignUtils.getDaysAndMonths(item._sum.days),
			total_days: item._sum.days,
			tag: Boolean(partner)
		};
	});

	return { rankings: list };
};
