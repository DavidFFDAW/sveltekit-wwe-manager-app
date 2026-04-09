import { MatchRepository } from '$lib/server/dao/repositories/match.repository.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) return redirect(302, '/admin/matchcards');

	const matchcardId = Number(id);
	if (isNaN(matchcardId)) return redirect(302, '/admin/matchcards');

	const cards = new MatchRepository();
	const matches = await cards.get({
		where: {
			id_match_card: matchcardId
		},
		orderBy: [
			{
				night: 'asc',
			},
			{
				order: 'asc',
			}
		]
	});

	return {
		matches: matches
	};
}