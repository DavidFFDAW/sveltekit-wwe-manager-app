import { AnalyticsRepository } from "$lib/server/dao/repositories/analytics.respository";

export async function load() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const repository = new AnalyticsRepository();

	// get today registered analytics grouped by event
	const analyticsData = await repository.get({
		where: {
			created_at: {
				gte: today,
			}
		},
		orderBy: {
			created_at: 'desc'
		}
	});

	return {
		metrics: analyticsData
	};
}