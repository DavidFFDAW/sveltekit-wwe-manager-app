import { MatchRepository } from '$lib/server/dao/repositories/match.repository.js';
import { Api } from '$lib/server/server.helpers.js';

export async function DELETE({ params, url }) {
    const matchId = params.id;
    const ppvId = url.searchParams.get('ppv');

    if (!matchId || !ppvId) {
        return Api.error('Missing match ID or PPV ID', 400);
    }

    try {
        const matchRepository = new MatchRepository();
        await matchRepository.delete({
            id: Number(matchId),
            id_match_card: Number(ppvId),
        });
        return Api.success('Match deleted successfully');
    } catch (error) {
        console.error('Error deleting match:', error);
        return Api.error('Failed to delete match', 500);
    }
}
