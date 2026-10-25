import { matchcard } from '$lib/server/dao/repositories/matchcard.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { Utils } from '$lib/utils/general.utils.js';
import { ppv } from '$lib/server/dao/repositories/ppv.repository.js';

export const load = async ({ url }) => {
    const slug = url.searchParams.get('slug') as string;

    const ppvs = await ppv.get({
        select: {
            id: true,
            name: true,
            image: true,
            game_date: true,
        },
        where: {
            active: true,
            type: 'ppv'
        },
        orderBy: {
            game_date: 'asc'
        }
    });

    const matchCardEvent = (await matchcard.getRow({
        where: { id: Number(slug) },
        include: {
            matches: true
        }
    })) as any;

    const ppvNames = ppvs.map((ppv) => ppv.name);

    return {
        event_card: {
            isUpdate: Boolean(matchCardEvent),
            event: matchCardEvent,
            slug: slug,
            ppvs: ppvNames,
            importPPV: ppvs,
        }
    };
};

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        try {
            const action = Helpers.getAction(formData);
            const updateId = Helpers.getUpdateID(formData);

            const ppv_date = formData.get('ppv_date_done') as string;
            const ppvRealDate = Utils.getUTCDate(ppv_date);

            const datas = {
                ppv_name: formData.get('ppv_name') as string,
                ppv_image: formData.get('ppv_image') as string,
                ppv_date: ppvRealDate
            };

            const upserted = action === 'create'
                ? await matchcard.create(datas)
                : await matchcard.updateById(updateId, datas);

            if (!upserted.id) return Helpers.error('Failed to create or update match card');
            return Helpers.success('Match card ' + (action === 'create' ? 'created' : 'updated') + ' successfully');
        } catch (error) {
            console.error('Error creating/updating match card:', error);
            return Helpers.error('Failed to create or update match card');
        }
    }
};
