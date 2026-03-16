import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import DateUtils from '$lib/utils/date.utils.js';
import { Utils } from '$lib/utils/general.utils.js';
import { ReignUtils } from '$lib/utils/reign.utils.js';

export const load = async ({ locals, url }) => {
    if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');

    const reigns = new ReignsRepository();
    const page = Number(url.searchParams.get('page') || '1');
    const paramChampionship = url.searchParams.get('id');
    const year = url.searchParams.get('year') ? Number(url.searchParams.get('year')) : new Date().getFullYear();
    const currentYear = new Date().getFullYear();

    const reignlist = await reigns.get({
        where: {
            OR: [
                {
                    won_date: {
                        gte: new Date(year, 0, 1),
                        lte: new Date(year, 11, 31),
                    },
                },
                {
                    won_date: {
                        lte: new Date(year, 0, 1),
                    },
                    lost_date: {
                        gte: new Date(year, 0, 1),
                    },
                },
                {
                    current: true,
                    won_date: {
                        lte: new Date(year, 0, 1),
                    },
                    lost_date: null,
                },
            ],
            Championship: { id: Number(paramChampionship) },
        },
        include: {
            Championship: { select: { id: true, name: true, slug: true, image: true, tag: true } },
            Team: { select: { id: true, name: true } },
            Wrestler: { select: { id: true, name: true, image_name: true } },
            Partner: { select: { id: true, name: true, image_name: true } },
        },
        orderBy: { won_date: 'asc' },
    });

    const firstReign = (await reigns.getRow({
        select: {
            won_date: true,
        },
        orderBy: { won_date: 'asc' },
        take: 1,
    })) as any;
    const firstYear = firstReign?.won_date ? firstReign.won_date.getFullYear() : currentYear;
    const differentYears = Array.from({ length: Math.abs(currentYear + 1 - firstYear) }, (_, i) => firstYear + i);
    const format: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

    return {
        reigns_panel: {
            type: 'reigns',
            currentYear: year,
            years: differentYears,
            championshipId: Number(paramChampionship),
            reigns: reignlist.map(
                reign =>
                    ({
                        ...reign,
                        won_date_str: reign.won_date ? Utils.toLocaleDate(reign.won_date, format) : '',
                        lost_date_str: reign.lost_date ? Utils.toLocaleDate(reign.lost_date, format) : '',
                        days_month: reign.days ? ReignUtils.getDaysAndMonths(reign.days) : '',
                    }) as any,
            ),
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

            const { error, message } = Helpers.checkRequiredFields(formData, ['won_date', 'victory_way', 'ppv_won']);
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
