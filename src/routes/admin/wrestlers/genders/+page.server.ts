import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';

const repository = new WrestlerRepository();

export const load = async ({ url }) => {
    const params = url.searchParams;
    const page = parseInt(params.get('page') || '1', 10) || 1;

    const wrestlers = await repository.paginateN(
        page,
        {
            orderBy: { name: 'asc' },
        },
        20,
    );
    return { wrestlers, list: wrestlers.list.map(w => ({ ...w, gender: w.sex.toLowerCase() === 'm' })) };
};

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        try {
            const statuses = formData.entries().reduce(
                (acc, [key, value]) => {
                    if (!['m', 'f'].includes(value.toString())) return acc;

                    if (key.startsWith('gender[') && key.endsWith(']')) {
                        const id = key.slice('gender['.length, -1);
                        acc[value.toString()] = acc[value.toString()] || [];
                        acc[value.toString()].push(Number(id));
                    }
                    return acc;
                },
                {} as Record<string, number[]>,
            );

            await repository.bulkUpdate(
                {
                    id: { in: statuses['m'] || [] },
                },
                { sex: 'm' },
            );
            await repository.bulkUpdate(
                {
                    id: { in: statuses['f'] || [] },
                },
                { sex: 'f' },
            );

            return Helpers.success('Estados de contratación actualizados');
        } catch (error) {
            console.error('Error updating wrestler statuses:', error);
            return Helpers.error('Error al actualizar los estados de contratación');
        }
    },
};
