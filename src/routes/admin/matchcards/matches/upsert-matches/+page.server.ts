import { ChampionshipRepository } from '$lib/server/dao/repositories/championship.repository';
import { MatchRepository } from '$lib/server/dao/repositories/match.repository.js';
// import { MatchRepository } from '$lib/server/dao/repositories/match.repository';
import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository.js';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ url }) => {
	const hasSlug = url.searchParams.has('slug');
	if (!hasSlug) return Helpers.redirection('/admin/matchcards');
	const slug = url.searchParams.get('slug') as string;

	const matchCardRepository = new PpvCardRepository();
	const matchCard = await matchCardRepository.getMatchCardWithMatches(slug);
	if (!matchCard) return Helpers.redirection('/admin/matchcards');

	const wrestlersRepository = new WrestlerRepository();
	const championshipRepository = new ChampionshipRepository();

	const championships = await championshipRepository.get({
		select: { name: true, slug: true },
		orderBy: { name: 'asc' }
	});
	const wrestlers = await wrestlersRepository.getNonReleasedWrestlers({
		select: { name: true, slug: true, status: true },
		orderBy: { slug: 'asc' }
	});

	const matches = matchCard.matches.map((match) => {
		return {
			id: match.id,
			type: 'update',
			stipulation: match.stipulation,
			participants: match.participants,
			championship: match.championship,
			night: match.night || 1,
			order: match.order
		};
	});

	return {
		match_card: {
			matchCard,
			matches: matches,
			slug: slug,
			wrestlers,
			championships
		}
	};
};

export const actions = {
	default: async ({ request, url }) => {
		const search = url.searchParams;
		const slug = search.get('slug');
		if (!slug) return Helpers.error('Invalid PPV card ID');

		const formData = await request.formData();
		const matchesByType = {
			create: formData.getAll('matches[create]') as string[],
			update: formData.getAll('matches[update]') as string[],
			delete: formData.getAll('matches[delete]') as string[]
		};
		console.log({ matchesByType });
		// return Helpers.error('Aún no está habilitada esta función', 401);

		try {
			const ppvCard = Helpers.getUpdateID(formData);
			const matchesIds = formData.getAll('matches[]') as string[];
			const matches = matchesIds.map((id) => {
				return {
					id: id.includes('create-') ? 0 : Number(id),
					type: formData.get(`match[${id}][type]`) as string,
					identifier: Number(formData.get(`match[${id}][identifier]`)) as number,
					stipulation: formData.get(`match[${id}][stipulation]`) as string,
					championship: formData.get(`match[${id}][championship]`) as string,
					participants: formData.get(`match[${id}][participants]`) as string,
					night: Number(formData.get(`match[${id}][night]`)) as number,
					order: Number(formData.get(`match[${id}][order]`)) as number
				};
			});

			const matchesToCreate = matches.filter((match) => match.type === 'create');
			const matchesToUpdate = matches.filter((match) => match.type === 'update');

			console.log({
				matchesToCreate,
				matchesToUpdate
			});
			const matchRepository = new MatchRepository();

			if (matchesByType.delete.length > 0) {
				await matchRepository.delete({
					id: { in: matchesByType.delete.map((id) => Number(id)) }
				});
			}

			if (!ppvCard) return Helpers.error('Invalid PPV card ID');
			return Helpers.error(
				'Ahora mismo no se puede responder a esta petición, contacta con el desarrollador para más información'
			);
		} catch (error) {
			console.error('Error creating/updating match card:', error);
			return Helpers.error('Failed to create or update match card');
		}
	}
};
