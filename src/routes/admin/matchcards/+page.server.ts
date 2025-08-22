import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository.js';

export const load = async () => {
    const ppvCardRepository = new PpvCardRepository();
    const matchcards = await ppvCardRepository.get({
        include: {
            _count: {
                select: {
                    matches: true,
                },
            },
        },
    });

    return {
        matchcards: matchcards.map(matchcard => {
            const matches = '_count' in matchcard ? (matchcard._count as any).matches : 0;
            return {
                ...matchcard,
                matches,
            };
        }),
    };
};
