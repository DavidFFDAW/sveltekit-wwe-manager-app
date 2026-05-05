import { ReignsRepository } from "$lib/server/dao/repositories/reigns.repository";

export const load = async ({ url }) => {
	const filterYear = url.searchParams.get('year');
	const currentYear = filterYear ? Number(filterYear) : new Date().getFullYear();

	const reigns = new ReignsRepository();
	const conn = reigns.conn();

	const availableYears: { year: number }[] = await conn.$queryRaw`SELECT DISTINCT EXTRACT(YEAR FROM won_date) AS year FROM championship_reigns r INNER JOIN championship c ON c.id = r.championship_id WHERE c.type = 'mitb' ORDER BY year DESC`;
	const currentYearMitbs = await reigns.get({
		where: {
			Championship: {
				type: 'mitb'
			},
			won_date: {
				gte: new Date(currentYear, 0, 1),
				lte: new Date(currentYear, 11, 31)
			},
		},
		orderBy: {
			won_date: 'desc'
		},
	})

	return {
		mitb: {
			currentYear,
			reigns: currentYearMitbs,
			availableYears: availableYears.map(y => y.year)
		}
	};
}