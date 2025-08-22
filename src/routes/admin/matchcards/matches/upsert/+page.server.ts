import fs from 'fs';
import { ChampionshipRepository } from '$lib/server/dao/repositories/championship.repository';
import { MatchRepository } from '$lib/server/dao/repositories/match.repository';
import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository.js';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { Utils } from '$lib/utils/general.utils.js';
import type { Prisma } from '@prisma/client';

export const load = async ({ url }) => {
    const wrestlersRepository = new WrestlerRepository();
    const championshipRepository = new ChampionshipRepository();

    const championships = await championshipRepository.get({
        select: { name: true, slug: true },
        orderBy: { name: 'asc' },
    });
    const wrestlers = await wrestlersRepository.getNonReleasedWrestlers({
        select: { name: true, slug: true, status: true },
        orderBy: { slug: 'asc' },
    });

    const hasSlug = url.searchParams.has('slug');
    if (!hasSlug)
        return {
            match_card: { isUpdate: false, matchCard: null, matches: [], wrestlers, championships },
        };

    const slug = url.searchParams.get('slug') as string;

    const matchCardRepository = new PpvCardRepository();
    const matchCard = await matchCardRepository.getMatchCardWithMatches(slug);
    if (!matchCard)
        return {
            match_card: { isUpdate: false, matchCard: null, matches: [], wrestlers, championships },
        };
    const matches = matchCard.matches.sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
    });

    return {
        match_card: {
            isUpdate: true,
            matchCard,
            matches: matches,
            slug: slug,
            wrestlers,
            championships,
        },
    };
};

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        try {
            const ppvCard = Helpers.getUpdateID(formData);
            if (!ppvCard) return Helpers.error('Invalid PPV card ID');

            const matchRepository = new MatchRepository();
            const parsedDatas = Utils.getArrayFormDatas(formData, [
                'match_id[]',
                'match_stipulation[]',
                'match_championship[]',
                'match_participants[]',
                'match_winner[]',
                'match_rating[]',
                'match_duration[]',
                'match_order[]',
            ]).map(match => {
                return {
                    _id: match.match_id ? Number(match.match_id) : 0,
                    stipulation: match.match_stipulation,
                    championship: match.match_championship || null,
                    participants: match.match_participants,
                    winner: match.match_winner || null,
                    rating: match.match_rating ? Number(match.match_rating) : null,
                    duration: match.match_duration ? Number(match.match_duration) : null,
                    order: match.match_order ? Number(match.match_order) : 1,
                    id_match_card: ppvCard,
                };
            });

            const creatingMatches = parsedDatas
                .filter(match => match._id === 0)
                .map(match => {
                    const { _id, ...rest } = match;
                    return {
                        ...rest, // Add required relation property
                    };
                });
            const updatingMatches = parsedDatas.filter(match => match._id !== 0);
            if (creatingMatches.length > 0) await matchRepository.bulkCreate(creatingMatches as any[]);
            if (updatingMatches.length > 0) {
                await Promise.all(
                    updatingMatches.map(match => {
                        const { _id, ...rest } = match;
                        return matchRepository.update({ id: _id }, rest);
                    }),
                );
            }

            fs.writeFileSync(
                'src/routes/admin/matchcards/matches/upsert/matches.json',
                JSON.stringify(
                    {
                        parsedDatas,
                        creatingMatches,
                        updatingMatches,
                    },
                    null,
                    4,
                ),
            );

            return Helpers.success('Match card created/updated successfully');
        } catch (error) {
            console.error('Error creating/updating match card:', error);
            return Helpers.error('Failed to create or update match card');
        }
    },
};
