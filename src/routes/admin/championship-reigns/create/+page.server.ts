import { ReignsAdapter, type CommonDatas } from '$lib/server/adapters/reigns.adapter.js';
import { ChampionshipDao } from '$lib/server/dao/championship.dao.js';
import { PPVDao } from '$lib/server/dao/ppv.dao.js';
import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { TeamsDao } from '$lib/server/dao/teams.dao';
import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';
import fs from 'fs';

export const load = async ({ locals }) => {
    if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');

    return {
        ppvs: await PPVDao.getPPVNames(),
        teams: await TeamsDao.getReignSelectableTeams(),
        wrestlers: await WrestlerDao.getReignSelectableWrestlers(),
        championships: await ChampionshipDao.getChampionships({
            select: { id: true, name: true, image: true, gender: true, tag: true },
        }),
    };
};

const updatePreviousReign = async (datas: CommonDatas) => {
    const previousReign = await ReignsDao.getLastCurrentReignFromChampionship(datas.championship.id);
    if (!previousReign) return false;

    const previousWonDate = new Date(previousReign.won_date);
    const previousChampionNewCalculatedDays = Math.abs(
        (datas.date_won.getTime() - previousWonDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    await ReignsDao.updateChampionshipReign(previousReign.id, {
        won_date: previousReign.won_date,
        lost_date: datas.date_won,
        days: previousChampionNewCalculatedDays,
        current: false,
    });

    return true;
};

export const actions = {
    default: async ({ request, locals }) => {
        if (!Helpers.hasPermission(locals))
            return Helpers.error('No tienes permisos suficientes para realizar esta acción');

        const formData = await request.formData();

        try {
            const datas = ReignsAdapter.getCommonDatas(formData);
            const objectifiedDatas = ReignsAdapter.getReignObject(datas);

            fs.writeFileSync(
                `./src/routes/admin/championship-reigns/create/create-${datas.type}reigns-log.json`,
                JSON.stringify(objectifiedDatas, null, 4),
            );
            if (!datas.date_won) return Helpers.error('Debes seleccionar una fecha de inicio', 400);
            if (!datas.championship.id) return Helpers.error('Debes seleccionar un campeonato', 400);

            if (datas.date_lost && datas.date_lost < datas.date_won)
                return Helpers.error('La fecha en la que se pierde un título no puede ser menor a la de inicio', 400);

            if (datas.current) await updatePreviousReign(datas);
            await ReignsDao.createChampionshipReign(objectifiedDatas);
            return Helpers.success('Reinado creado correctamente');
        } catch (error) {
            if (error instanceof Error) return Helpers.error('Error: ' + error.message, 400);
            return Helpers.error('No se ha podido crear el reinado', 400);
        }
    },
};
