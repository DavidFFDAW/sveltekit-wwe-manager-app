import { championship } from '$lib/server/dao/repositories/championship.repository';
import { match } from '$lib/server/dao/repositories/match.repository.js';
// import { match } from '$lib/server/dao/repositories/match.repository';
import { matchcard } from '$lib/server/dao/repositories/matchcard.repository.js';
import { wrestlers } from '$lib/server/dao/repositories/wrestler.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async ({ url }) => {
    const hasSlug = url.searchParams.has('slug');
    if (!hasSlug) return Helpers.redirection('/admin/matchcards');
    const slug = url.searchParams.get('slug') as string;

    const matchCard = await matchcard.getMatchCardWithMatches(slug);
    if (!matchCard) return Helpers.redirection('/admin/matchcards');

    const championships = await championship.get({
        select: { name: true, slug: true },
        where: { active: true },
        orderBy: { name: 'asc' }
    });
    const wrestlerList = await wrestlers.getNonReleasedWrestlers({
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
            wrestlers: wrestlerList,
            championships
        }
    };
};

const getMatchDatas = (id: string, formData: FormData) => {
    return {
        id: id,
        type: formData.get(`match[${id}][type]`) as string,
        order: Number(formData.get(`match[${id}][order]`)) as number,
        stipulation: formData.get(`match[${id}][stipulation]`) as string,
        participants: formData.get(`match[${id}][participants]`) as string,
        championship: formData.get(`match[${id}][championship]`) as string,
        night: Number(formData.get(`match[${id}][night]`)) as number
    };
};

export const actions = {
    default: async ({ request, url }) => {
        const search = url.searchParams;
        const slug = search.get('slug');
        if (!slug) return Helpers.error('Invalid PPV card ID');

        const formData = await request.formData();
        const ppv_id = formData.get('_update_id') as string;
        if (!ppv_id) return Helpers.error('Invalid PPV card ID');
        if (ppv_id !== slug)
            return Helpers.error(
                'Hay un error con el id del PPV, recarga la página y vuelve a intentarlo'
            );

        const matchesByType = {
            create: formData.getAll('matches[create]') as string[],
            update: formData.getAll('matches[update]') as string[],
            delete: formData.getAll('matches[delete]') as string[]
        };

        const matchesToCreate = matchesByType.create.map((id) => getMatchDatas(id, formData));
        const matchesToUpdate = matchesByType.update.map((id) => getMatchDatas(id, formData));
        const matchesToDelete = matchesByType.delete.map((id) => Number(id));

        try {
            if (matchesToDelete.length > 0) await match.bulkDeleteIn(matchesToDelete);

            const createDatas = matchesToCreate.map((match) => {
                return {
                    stipulation: match.stipulation,
                    participants: match.participants,
                    championship: match.championship,
                    night: match.night,
                    order: match.order,
                    id_match_card: Number(ppv_id)
                };
            }) as any[];

            if (createDatas.length > 0) await match.bulkCreate(createDatas);

            const updatePromises = matchesToUpdate.map((singleMatch) => {
                return match.updateById(Number(singleMatch.id), {
                    stipulation: singleMatch.stipulation,
                    participants: singleMatch.participants,
                    championship: singleMatch.championship,
                    night: singleMatch.night,
                    order: singleMatch.order
                });
            });
            if (updatePromises.length > 0) await Promise.all(updatePromises);

            return Helpers.success('Se ha actualizado la match card correctamente');
        } catch (error) {
            console.error('Error creating/updating match card:', error);
            return Helpers.error('Failed to create or update match card');
        }
    }
};
