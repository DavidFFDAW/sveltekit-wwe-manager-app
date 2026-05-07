import { ReignsRepository } from "$lib/server/dao/repositories/reigns.repository";
import { Utils } from "$lib/utils/general.utils";
import { ReignUtils } from "$lib/utils/reign.utils.js";

export const load = async ({ url }) => {
	const filterYear = url.searchParams.get('year') as string | null;
	const currentYear = url.searchParams.has('year') ? Number(filterYear) : new Date().getFullYear();

	const reigns = new ReignsRepository();
	const conn = reigns.conn();

	const years: any = await conn.$queryRaw`SELECT DISTINCT EXTRACT(YEAR FROM won_date) AS year FROM championship_reigns r INNER JOIN championship c ON c.id = r.championship_id WHERE c.type = 'mitb' ORDER BY year DESC`;
	const availableYears = years.map((y: any) => parseInt(y.year, 10));
	const filterReal = availableYears.includes(currentYear) ? currentYear : availableYears[0];

	const currentYearMitbs = await reigns.get({
		select: {
			Wrestler: {
				select: { id: true, name: true, slug: true, image_name: true }
			},
			Championship: {
				select: { id: true, name: true, image: true, gender: true }
			},
			id: true,
			won_date: true,
			lost_date: true,
			current: true,
			ppv_won: true,
			days: true,
			victory_way: true,
		},
		where: {
			Championship: {
				type: 'mitb'
			},
			won_date: {
				gte: new Date(filterReal, 0, 1),
				lte: new Date(filterReal, 11, 31)
			},
		},
		orderBy: {
			Championship: {
				gender: 'desc'
			}
		},
	}) as any[];

	const firstReignYear = currentYearMitbs.length > 0 ? currentYearMitbs[0].won_date.getFullYear() : filterReal;

	return {
		mitb: {
			currentYear: firstReignYear === currentYear ? currentYear : firstReignYear,
			availableYears: availableYears,
			reigns: currentYearMitbs.map(reign => ({
				...reign,
				won_date: Utils.formatDate(reign.won_date),
				lost_date: reign.lost_date ? Utils.formatDate(reign.lost_date) : null,
				days_held: ReignUtils.formatReignDays(reign.days),
			})),
		}
	};
}