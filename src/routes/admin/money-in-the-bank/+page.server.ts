import { ReignsRepository } from "$lib/server/dao/repositories/reigns.repository";

export const load = async ({ url }) => {
	const filterYear = url.searchParams.get('year') as string | null;
	const currentYear = url.searchParams.has('year') ? Number(filterYear) : new Date().getFullYear();

	const reigns = new ReignsRepository();
	const conn = reigns.conn();

	const years: any = await conn.$queryRaw`SELECT DISTINCT EXTRACT(YEAR FROM won_date) AS year FROM championship_reigns r INNER JOIN championship c ON c.id = r.championship_id WHERE c.type = 'mitb' ORDER BY year DESC`;
	console.log({ years });

	const availableYears = years.map((y: any) => parseInt(y.year, 10));
	const filterReal = availableYears.includes(currentYear) ? currentYear : availableYears[0];

	const currentYearMitbs = await reigns.get({
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
			won_date: 'desc'
		},
	});

	console.log({
		currentYear,
		currentYearMitbs,
		availableYears
	});


	return {
		mitb: {
			currentYear,
			reigns: currentYearMitbs,
			availableYears: availableYears,
		}
	};
}