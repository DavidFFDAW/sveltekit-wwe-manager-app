import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { Utils } from '$lib/utils/general.utils';
import { ReignUtils } from '$lib/utils/reign.utils.js';

const reignsRepo = new ReignsRepository();

export const load = async () => {
	const reigns = await reignsRepo.get({
		where: {
			current: true,
			lost_date: null,
			can_stats_count: true,
			Championship: {
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
		reigns: reigns.map((reign: any) => {
			return {
				...reign,
				time_days: ReignUtils.getDaysAndMonths(reign.days),
				ranking_status: ReignUtils.getReignRankingStatus(reign),
				calculated_name: ReignUtils.getWrestlerOrTeamName(reign),
				updated_ellapsed: reign.updated_at ? Utils.getEllapsedTime(reign.updated_at) : null
			};
		})
	};
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		try {
			const reignsRepo = new ReignsRepository();
			const parsed = Utils.getArrayFormDatas(formData, ['reign-id', 'defenses']);
			const numericParsedValues = parsed.map((item) => {
				return {
					id: parseInt(item['reign-id'], 10),
					defenses: parseInt(item['defenses'], 10)
				};
			});

			const currentReigns = await reignsRepo.toMap({
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
				return reignsRepo.bulkUpdate({ id: { in: ids } }, { defences: parseInt(defenses, 10) });
			});
			await Promise.all(promises);
			return Helpers.success('Defensas de los reinados de campeonato actualizadas correctamente');
		} catch (error) {
			console.error('Error updating championship reign defence:', error);
			return Helpers.error('Error actualizando la defensa del reinado del campeonato', 500);
		}
	}
};
