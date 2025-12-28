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

	return {
		matchcards: matchcards.map((matchcard) => {
			const matches = '_count' in matchcard ? (matchcard._count as any).matches : 0;
			return {
				...matchcard,
				matches
			};
		}),
		uniqueYears: uniqueYears,
		selectedYear: yearFilter ? Number(yearFilter) : null
	};
};
