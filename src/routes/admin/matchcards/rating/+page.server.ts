import { Helpers } from '$lib/server/server.helpers.js';
import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository';
import type { Match, PPVCard } from '@prisma/client';
import { MatchRepository } from '$lib/server/dao/repositories/match.repository.js';

export const load = async ({ url }) => {
	const slug = url.searchParams.get('slug');
	if (!slug) return Helpers.redirection('/admin/matchcards');

	const repository = new PpvCardRepository();
	const matchCardEvent = (await repository.getRow({
		where: { id: Number(slug) },
		include: {
			matches: {
				orderBy: [{ order: 'asc' }, { night: 'asc' }]
			}
		}
	})) as PPVCard & { matches: Match[] };
	if (!matchCardEvent) return Helpers.redirection('/admin/matchcards');
	const { matches, ...event } = matchCardEvent;
	const nights = matches.reduce((acc: Record<string, Match[]>, match) => {
		if (!match.night) return acc;
		if (!(match.night in acc)) acc[match.night] = [];
		acc[match.night].push(match);
		return acc;
	}, {})

	return {
		rating: {
			notice: url.searchParams.has('notice'),
			matches: matches,
			nights: nights,
			event: event,
			slug: slug
		}
	};
};

export const actions = {
	default: async ({ request }) => { 
		const data = await request.formData();
		const ppv_id = data.get('ppv_id');
		if (!ppv_id || typeof ppv_id !== 'string') return Helpers.error('PPV ID is required', 400);
		const matches = data.getAll('matches[]') as string[];

		try {
			const repository = new MatchRepository();
			// const currentMatches = await repository.get({
			// 	where: { id_match_card: Number(ppv_id) }
			// });

			const map = new Map<number, { rating: number | null; winner: string | null }>(
				matches.map((match_id: string) => [Number(match_id), {
					rating: data.has(`rating[${match_id}]`) ? Number(data.get(`rating[${match_id}]`)) : null,
					winner: data.get(`winner[${match_id}]`) as string || null
				}])
			);

			const promises = Array.from(map.entries()).map(([match_id, matchData]) => { 
				return repository.updateById(Number(match_id), {
					rating: matchData.rating,
					winner: matchData.winner
				});
			});
			
			await Promise.all(promises);
			return Helpers.success('Se han actualizado las valoraciones de los combates', 200);
		} catch (error) {
			console.error('Error updating match ratings:', error);
			return Helpers.error('An error occurred while updating match ratings', 500);
		}
	}
};