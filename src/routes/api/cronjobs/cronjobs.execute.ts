import cronjobs from '$lib/server/dao/cronjobs';
import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { AnalyticsRepository } from '$lib/server/dao/repositories/analytics.respository';

const cronMap: Record<string, () => Promise<any>> = {
	'update-reigns': ReignsDao.updateCurrentChampionshipReignDays,
	'delete-old-analytics': async () => {
		const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		const repository = new AnalyticsRepository();
		return repository.delete({
			created_at: {
				lt: sevenDaysAgo
			}
		});
	}
};

export async function executeCronBySlug(slug: string, updateDate = true) {
	const fn = cronMap[slug];
	if (!fn) throw new Error(`Cronjob "${slug}" no está definido.`);
	await fn();
	if (updateDate) await cronjobs.updateExecutionDate(slug);
}
