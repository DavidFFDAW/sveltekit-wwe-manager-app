import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';
// import { TeamsRepository } from '$lib/server/dao/repositories/teams.repository';
// import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';
// import { ReignUtils } from '$lib/utils/reign.utils';

export const load = async () => {
    // const reigns = new ReignsRepository();
    // 1. obtener reinados agrupados por wrestler_id con conteo (reinados, total_dias) limitado por pagina
    // 2. almacenar los ids de los luchadores de este listado.
    // 3. obtener reinados agrupados por partner con conteo (reinados, total_dias) para los ids anteriores
    // 4. obtenemos ids de partners y los unimos a los ids de la primera consulta
    // 5. obtenemos datos de los luchadores con esos ids
    // 6. mergeamos los datos de los luchadores con los resultados de los equipos
    // 7. sumamos los reinados y los dias en aquellos casos que sea necesario.
    // 8. volvemos a ordenar el resultado por dias y reinados (puede haber cambiado tras los cambios)

    const parsed = [''];

    return {
        ranking: {
            list: parsed,
            // wrestlerIds,
            // uniqueWrestlerIds,
            // wrestlersMap,
            // parsed,
        },
    };
};
