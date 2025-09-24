import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { Utils } from '$lib/utils/general.utils';

export const load = async () => {
	return { reigns: await ReignsDao.getCurrentChampionsDefences() };
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

			const sameDefensesGroup = numericParsedValues.reduce(
				(acc, item) => {
					if (!acc[item.defenses]) acc[item.defenses] = [];
					acc[item.defenses].push(item.id);
					return acc;
				},
				{} as Record<number, number[]>
			);

			const reignsRepo = new ReignsRepository();
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
