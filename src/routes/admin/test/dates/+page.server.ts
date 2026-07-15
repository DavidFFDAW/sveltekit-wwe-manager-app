import { DateUtils } from "$lib/utils/date.utils";

export const load = async () => {
	const date = new Date();
	const madridDate = DateUtils.getDateInstanceTimezone(date, 'Europe/Madrid');

	return { date, madridDate };
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const dateString = formData.get('date') as string | null;
		const date = new Date(dateString || '');
		date.setHours(0, 0, 0, 0);

		return { dateString, date };
	}
}