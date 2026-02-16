import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { ChampionshipRepository } from '$lib/server/dao/repositories/championship.repository.js';
import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import DateUtils from '$lib/utils/date.utils.js';
import { Utils } from '$lib/utils/general.utils.js';
import { ReignUtils } from '$lib/utils/reign.utils.js';

export const load = async ({ locals, url }) => {
    if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');

    const page = Number(url.searchParams.get('page') || '1');
    const paramChampionship = url.searchParams.get('championship');

    const reigns = new ReignsRepository();
    const championships = new ChampionshipRepository();

    if (!paramChampionship) {
        const uniqueChampionships = await reigns.get({
            select: { championship_id: true },
            distinct: ['championship_id'],
        });

        const championshipIds = uniqueChampionships.map(reign => reign.championship_id);
        const list = await championships.get({
            select: { id: true, name: true, slug: true, image: true, active: true, tag: true },
            where: { id: { in: championshipIds } },
            orderBy: [{ active: 'desc' }, { order: 'asc' }],
        });

        return {
            reigns_panel: {
                type: 'championships',
                championships: list,
                reigns: [],
            },
        };
    }

    const reignlist = await reigns.paginateN(
        page,
        {
            where: { Championship: { id: Number(paramChampionship) } },
            include: {
                Championship: { select: { id: true, name: true, slug: true, image: true, tag: true } },
                Team: { select: { id: true, name: true } },
                Wrestler: { select: { id: true, name: true, image_name: true } },
                Partner: { select: { id: true, name: true, image_name: true } },
            },
            orderBy: { won_date: 'asc' },
        },
        20,
    );

    const { list, ...pagination } = reignlist;

    return {
        reigns_panel: {
            type: 'reigns',
            championships: [],
            reigns: list.map(
                reign =>
                    ({
                        ...reign,
                        won_date_str: reign.won_date ? Utils.formatDate(reign.won_date) : 'N/A',
                        lost_date_str: reign.lost_date ? Utils.formatDate(reign.lost_date) : 'N/A',
                        days_month: reign.days ? ReignUtils.getDaysAndMonths(reign.days) : 'N/A',
                    }) as any,
            ),
            pagination,
        },
    };

    // const championshipReigns = await ReignsDao.getChampionshipReignsOrderedWithTeamNames({
    //     won_date: 'asc',
    // });

    // const groupedByChampionship = championshipReigns.reduce((acc: Record<number, (typeof reign)[]>, reign) => {
    //     const championshipId = reign.Championship.id;
    //     if (!acc[championshipId]) {
    //         acc[championshipId] = [];
    //     }
    //     acc[championshipId].push(reign);
    //     return acc;
    // }, {});

    // return {
    //     reigns: Object.entries(groupedByChampionship),
    //     championships: Object.values(groupedByChampionship).map(reigns => reigns[0].Championship),
    // };
};

export const actions = {
    default: async ({ request, locals }) => {
        if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/admin');
        const formData = await request.formData();

        try {
            const updateID = Helpers.getUpdateID(formData);
            if (!updateID || isNaN(updateID)) return Helpers.error('ID de actualización no válido.', 400);

            const { error, message } = Helpers.checkRequiredFields(formData, [
                'won_date',
                'lost_date',
                'defences',
                'victory_way',
                'ppv_won',
            ]);
            if (error) return Helpers.error(message, 400);

            const reignExists = await ReignsDao.reignExists(updateID);
            if (!reignExists) return Helpers.error('El reinado no existe.', 404);

            const wonDate = new Date(formData.get('won_date') as string);
            if (!wonDate || isNaN(wonDate.getTime())) return Helpers.error('Fecha de inicio no válida.', 400);

            const lostDate = formData.get('lost_date') ? new Date(formData.get('lost_date') as string) : null;

            if (lostDate && lostDate < wonDate)
                return Helpers.error('La fecha de pérdida no puede ser anterior a la fecha de inicio.', 400);

            const defences = formData.get('defences') ? Number(formData.get('defences')) : 0;
            if (isNaN(defences)) return Helpers.error('Número de defensas no válido.', 400);
            const days = DateUtils.getDaysBetweenDates(wonDate, lostDate || new Date());

            const updated = await ReignsDao.updateChampionshipReign(updateID, {
                won_date: wonDate,
                lost_date: lostDate,
                days,
                defences,
                victory_way: (formData.get('victory_way') as string) || null,
                ppv_won: (formData.get('ppv_won') as string) || null,
            });
            if (!updated) return Helpers.error('No se pudo actualizar el reinado.', 500);
            return Helpers.success('Reinado actualizado correctamente.', 200);
        } catch (error) {
            console.error('Error al procesar el formulario:', error);
            return Helpers.error('Error al procesar el formulario.', 500);
        }
    },
};
