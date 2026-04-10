import { redirect } from '@sveltejs/kit';
import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository.js';

export const load = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) return redirect(302, '/admin/matchcards');

	const matchcardId = Number(id);
	if (isNaN(matchcardId)) return redirect(302, '/admin/matchcards');

	const repository = new PpvCardRepository();
	const card_data = await repository.getRow({
		where: {
			id: matchcardId
		},
		include: {
			matches: {
				orderBy: [
					{
						night: 'asc'
					},
					{
						order: 'asc'
					}
				]
			}
		}
	});

	const matches = 'matches' in card_data ? (card_data.matches as any[]) : [];
	const groupedByNight: Record<string, any[]> = matches.reduce((acc, match) => {
		const night = match.night || 1;
		if (!acc[night]) {
			acc[night] = [];
		}
		acc[night].push(match);
		return acc;
	}, {});

	return {
		ppv: {
			id: card_data.id,
			name: card_data.ppv_name,
			image: card_data.ppv_image,
			date: card_data.ppv_date
		},
		matches: groupedByNight,
		nights: Object.keys(groupedByNight).map((night) => Number(night))
	};
};
