import { PPVRepository } from '$lib/server/dao/repositories/ppv.repository';
import { Helpers } from '$lib/server/server.helpers.js';
import { Utils } from '$lib/utils/general.utils.js';

export type PPVCalendarEntry = {
	id: number;
	name: string;
	abbreviation: string;
	image: string;
	date: Date;
};

export async function load({ request }) {
	const ppvRepo = new PPVRepository();
	const ppvs = await ppvRepo.get({
		where: { active: true, visible: true },
		orderBy: { game_date: 'asc' }
	});

	const ppvsObject = ppvs.reduce(
		(acc, ppv) => {
			if (!ppv.game_date) return acc;

			acc[ppv.game_date.toISOString().split('T')[0]] = {
				id: ppv.id,
				name: ppv.name,
				abbreviation: ppv.abbreviation as string,
				image: ppv.image as string,
				date: ppv.game_date
			};
			return acc;
		},
		{} as Record<string, PPVCalendarEntry>
	);

	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		request.headers.get('user-agent') || ''
	);

	const today = new Date();
	const processedPpvs = ppvs
		.map((ppv) => {
			ppv.game_date?.setFullYear(today.getFullYear());
			return ppv;
		})
		.sort((a, b) => {
			if (a.game_date && b.game_date) {
				return a.game_date.getTime() - b.game_date.getTime();
			}
			return 0;
		});

	return {
		ppvs: processedPpvs,
		ppvCalendar: ppvsObject,
		isMobile: isMobile
	};
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const entries = Array.from(formData.entries());

		try {
			const repository = new PPVRepository();
			const updatePpvDatePromises = entries
				.filter(([key]) => key.startsWith('ppv_calendar_dates['))
				.map(([key, value]) => {
					const regex = /^ppv_calendar_dates\[(\d+)\]$/;
					const match = key.match(regex);
					return match ? { id: parseInt(match[1], 10), date: value as string } : null;
				})
				.map((item) => (item ? repository.updatePpvDate(item.id, new Date(item.date)) : null));

			await Promise.all(updatePpvDatePromises);
			return Helpers.success('Las fechas de PPVs se han actualizado correctamente.');
		} catch (error) {
			console.error('Error updating PPV calendar dates:', error);
			return Helpers.error('An error occurred while updating the calendar dates.', 500);
		}
	}
};
