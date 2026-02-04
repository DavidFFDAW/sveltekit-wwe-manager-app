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
        const entries = Array.from(formData.entries());
        if (entries.length === 0) return Helpers.error('No se enviaron datos en el formulario');

        try {
            const statuses = entries.reduce(
                (acc, [key, value]) => {
                    if (!key.startsWith('gender[')) return acc;
                    if (!['m', 'f'].includes(value.toString())) return acc;

                    const id = key.slice('gender['.length, -1);
                    acc[value.toString()] = acc[value.toString()] || [];
                    acc[value.toString()].push(Number(id));
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

            return Helpers.success('Géneros actualizados correctamente');
        } catch (error) {
            console.error('Error updating wrestler genders:', error);
            return Helpers.error('Error al actualizar los géneros');
        }
    },
};
