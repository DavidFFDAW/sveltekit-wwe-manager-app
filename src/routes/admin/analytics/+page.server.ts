import { analytics } from "$lib/server/dao/repositories/analytics.respository";

export async function load() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// get today registered analytics grouped by event
	const analyticsData = await analytics.get({
		where: {
			created_at: {
				lte: today,
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
