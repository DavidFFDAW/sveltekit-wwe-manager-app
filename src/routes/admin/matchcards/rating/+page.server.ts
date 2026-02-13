import { Helpers } from '$lib/server/server.helpers.js';
import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository';
import type { Match, PPVCard } from '@prisma/client';

export const load = async ({ url }) => {
    const slug = url.searchParams.get('slug');
    if (!slug) return Helpers.redirection('/admin/matchcards');

    const repository = new PpvCardRepository();
    const matchCardEvent = (await repository.getRow({
        where: { id: Number(slug) },
        include: {
            matches: {
                orderBy: { order: 'asc' },
            },
        },
    })) as PPVCard & { matches: Match[] };
    if (!matchCardEvent) return Helpers.redirection('/admin/matchcards');
    const { matches, ...event } = matchCardEvent;

    return {
        rating: {
            matches: matches,
            event: event,
            slug: slug,
        },
    };
};
