import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository.js';

export const load = async ({ url }) => {
	const searchParams = url.searchParams;
	const yearFilter = searchParams.has('year') ? searchParams.get('year') : new Date().getFullYear();
	const whereSentence = yearFilter
		? {
				ppv_date: {
					gte: new Date(`${yearFilter}-01-01`),
					lte: new Date(`${yearFilter}-12-31`)
				}
			}
		: {};
	const ppvCardRepository = new PpvCardRepository();
	const uniqueYears = await ppvCardRepository.getUniquePpvYears();
	const matchcards = await ppvCardRepository.get({
		where: whereSentence,
		orderBy: { ppv_date: 'asc' },
		include: {
			_count: {
				select: { matches: true }
			}
		}
	});

	// const dateFrom = new Date(`${yearFilter}-01-01`);
	// const dateTo = new Date(`${yearFilter}-12-31`);

	// const prisma = ppvCardRepository.conn();
	// const rows = await prisma.$queryRaw<any[]>`
	// 	SELECT
	// 		m.id_match_card,
	// 		p.ppv_name,
	// 		p.ppv_date,
	// 		p.ppv_image,
	// 		COUNT(m.id) as matches,
	// 		ROUND(AVG(m.rating), 2) as average,
	// 		MAX(m.night) as nights
	// 	FROM matchs m
	// 	INNER JOIN ppv_card p ON p.id = m.id_match_card
	// 	WHERE p.ppv_date >= ${dateFrom}
	// 		AND p.ppv_date <= ${dateTo}
	// 	GROUP BY m.id_match_card, p.ppv_name, p.ppv_date, p.ppv_image
	// 	ORDER BY p.ppv_date ASC
	// `;
	// const parsedRows = rows.map((row) => ({
	// 	...row,
	// 	matches: Number(row.matches),
	// 	average: Number(row.average),
	// 	nights: Number(row.nights)
	// }));

	return {
		matchcards: matchcards.map((matchcard) => {
			const matches = '_count' in matchcard ? (matchcard._count as any).matches : 0;
			return {
				...matchcard,
				matches,
				hasSummaryPost: Boolean(matchcard.post_id)
			};
		}),
		uniqueYears: uniqueYears,
		selectedYear: yearFilter ? Number(yearFilter) : null,
		// aggregatedMatches: parsedRows
	};
};
