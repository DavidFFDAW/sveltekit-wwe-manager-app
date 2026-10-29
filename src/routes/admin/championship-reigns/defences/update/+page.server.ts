import { reigns } from '$lib/server/dao/repositories/reigns.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { Utils } from '$lib/utils/general.utils';
import { ReignUtils } from '$lib/utils/reign.utils.js';
import type { ChampionshipReign } from '@prisma/client';

export const load = async () => {
	const reignList = await reigns.get({
		where: {
			current: true,
			lost_date: null,
			can_stats_count: true,
			Championship: {
				type: { not: 'mitb' },
				active: true
			}
		},
		include: {
			Wrestler: true,
			Championship: true,
			Partner: true,
			Team: true
		},
		orderBy: [
			{ won_date: 'desc' },
			{ days: 'desc' }
		]
	});

	return {
		reigns: reignList.map((reign: ChampionshipReign) => {
			return {
				...reign,
				time_days: ReignUtils.getDaysAndMonths(reign.days),
				ellapsed_time: reign.won_date.getEllapsedTimeBetweenDates(reign.lost_date),
				ranking_status: ReignUtils.getReignRankingStatus(reign),
				calculated_name: ReignUtils.getWrestlerOrTeamName(reign as any),
				updated_ellapsed: reign.last_time_updated ? Utils.getEllapsedTime(reign.last_time_updated) : null
			};
		})
	};
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		try {
			const parsed = Utils.getArrayFormDatas(formData, ['reign-id', 'defenses']);
			const numericParsedValues = parsed.map((item) => {
				return {
					id: parseInt(item['reign-id'], 10),
					defenses: parseInt(item['defenses'], 10)
				};
			});

			const currentReigns = await reigns.toMap({
				where: {
					current: true,
					lost_date: null,
					can_stats_count: true,
					Championship: {
						active: true
					}
				}
			});

			const onlyChangedDefenses = numericParsedValues.filter((item) => {
				const currentReign = currentReigns.get(item.id);
				if (!currentReign) return false;
				return currentReign.defences !== item.defenses;
			});

			const sameDefensesGroup = onlyChangedDefenses.reduce(
				(acc, item) => {
					if (!acc[item.defenses]) acc[item.defenses] = [];
					acc[item.defenses].push(item.id);
					return acc;
				},
				{} as Record<number, number[]>
			);

			const promises = Object.entries(sameDefensesGroup).map(([defenses, ids]) => {
				return reigns.bulkUpdate({ id: { in: ids } }, { defences: parseInt(defenses, 10), last_time_updated: new Date() });
			});
			await Promise.all(promises);
			return Helpers.success('Defensas de los reinados de campeonato actualizadas correctamente');
		} catch (error) {
			console.error('Error updating championship reign defence:', error);
			return Helpers.error('Error actualizando la defensa del reinado del campeonato', 500);
		}
	}
};
