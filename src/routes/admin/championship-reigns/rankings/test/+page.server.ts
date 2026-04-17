import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';
import { Helpers } from '$lib/server/server.helpers';
import { ReignUtils } from '$lib/utils/reign.utils';
// import { TeamsRepository } from '$lib/server/dao/repositories/teams.repository';
// import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';
// import { ReignUtils } from '$lib/utils/reign.utils';

export const load = async ({ url }) => {
    const reigns = new ReignsRepository();
    const wrestlers = new WrestlerRepository();
    const pagination = Helpers.getPaginationFromSearchParams(url.searchParams);

    // 1. obtener reinados agrupados por wrestler_id con conteo (reinados, total_dias) limitado por pagina
    const groupedByWrestler = await reigns.getGroupedReignsWithCount(['wrestler_id'], {
        take: pagination.limit,
        skip: pagination.offset,
    });
    // 2. almacenar los ids de los luchadores de este listado.
    const wrestlerIds = groupedByWrestler.map(r => r.wrestler_id).filter(Boolean);

    // 3. obtener reinados agrupados por partner con conteo (reinados, total_dias) para los ids anteriores
    const groupedByPartner = await reigns.getGroupedReignsWithCount(['partner'], {
        where: {
            partner: { in: wrestlerIds },
        },
    });
    const partnersMap = new Map(groupedByPartner.map(p => [p.partner, p]));

    // 4. obtenemos ids de partners y los unimos a los ids de la primera consulta
    const partnerIds = groupedByPartner.map(r => r.partner).filter(Boolean);
    const uniqueWrestlerIds = Array.from(new Set([...wrestlerIds, ...partnerIds])) as number[];

    // 5. obtenemos datos de los luchadores con esos ids
    const wrestlersData = await wrestlers.toMap({
        select: {
            id: true,
            name: true,
            slug: true,
            image_name: true,
        },
        where: {
            id: {
                in: uniqueWrestlerIds,
            },
        },
    });

    // 6. mergeamos los datos de los luchadores con los resultados de los equipos
    // 7. sumamos los reinados y los dias en aquellos casos que sea necesario.
    // 8. volvemos a ordenar el resultado por dias y reinados (puede haber cambiado tras los cambios)
    const result = groupedByWrestler
        .map(wrestlerGroup => {
            const partnerGroup = partnersMap.get(wrestlerGroup.wrestler_id);
            const wrestlerData = wrestlersData.get(wrestlerGroup.wrestler_id);

            const counts = {
                w_reigns: wrestlerGroup._count?.championship_id || 0,
                w_days: wrestlerGroup._sum?.days || 0,
                p_reigns: partnerGroup?._count?.championship_id || 0,
                p_days: partnerGroup?._sum?.days || 0,
            };

            return {
                id: wrestlerGroup.wrestler_id,
                wrestler: {
                    id: wrestlerGroup.wrestler_id,
                    name: wrestlerData?.name || 'Unknown',
                    slug: wrestlerData?.slug || '',
                    image: wrestlerData?.image_name || '/vacant.webp',
                },
                reigns: counts.w_reigns + counts.p_reigns,
                days: counts.w_days + counts.p_days,
                days_str: ReignUtils.formatReignDays(counts.w_days + counts.p_days),
                has_partner_reigns: counts.p_reigns > 0,
            };
        })
        .sort((a, b) => {
            if (b.reigns === a.reigns) {
                return b.days - a.days;
            }
            return b.reigns - a.reigns;
        });

    return {
        ranking: {
            list: result,
            page: pagination.page,
        },
    };
};
