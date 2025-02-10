import { Helpers } from '$lib/server/server.helpers';
import { TeamsDao } from '$lib/server/dao/teams.dao';

interface TeamsByGender {
    men: number[];
    women: number[];
    mixed: number[];
}

export async function POST({ locals }) {
    if (!Helpers.hasPermission(locals, 'admin'))
        return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

    try {
        const initialObject: TeamsByGender = { men: [], women: [], mixed: [] };
        const teams = await TeamsDao.getReignSelectableTeams();
        const teamsByGender = teams.reduce<TeamsByGender>((accumulator, team) => {
            if (team.members.every(member => member.sex.toLowerCase() === 'm')) {
                accumulator['men'].push(team.id);
                return accumulator;
            }
            if (team.members.every(member => member.sex.toLowerCase() === 'f')) {
                accumulator['women'].push(team.id);
                return accumulator;
            }

            accumulator['mixed'].push(team.id);
            return accumulator;
        }, initialObject);

        await Promise.all([
            TeamsDao.bulkUpdateGender('m', teamsByGender.men),
            TeamsDao.bulkUpdateGender('f', teamsByGender.women),
            TeamsDao.bulkUpdateGender('x', teamsByGender.mixed),
        ]);

        return Helpers.apiResponseMessage('Se han actualizado los géneros de los equipos', 200);
    } catch (err) {
        if (err instanceof Error) return Helpers.apiResponseMessage(err.message, 500);
        return Helpers.apiResponseMessage('Un error desconocido ha ocurrido', 500);
    }
}
