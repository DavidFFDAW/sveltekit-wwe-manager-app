import cronjobs from '$lib/server/dao/cronjobs';
import { ReignsDao } from '$lib/server/dao/reigns.dao';

const cronMap: Record<string, () => Promise<any>> = {
	'update-reigns': ReignsDao.updateCurrentChampionshipReignDays
};

export async function executeCronBySlug(slug: string, updateDate = true) {
	const fn = cronMap[slug];
	if (!fn) throw new Error(`Cronjob "${slug}" no está definido.`);
	await fn();
	if (updateDate) await cronjobs.updateExecutionDate(slug);
}
