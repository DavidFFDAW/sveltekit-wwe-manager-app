import { reigns } from '$lib/server/dao/repositories/reigns.repository';
import { wrestlers } from '$lib/server/dao/repositories/wrestler.repository';
import { ReignUtils } from '$lib/utils/reign.utils';

export const load = async () => {
    const conn = reigns.conn();
    const list = await conn.$queryRaw`SELECT
        w.id AS wrestler_id,
        w.name,
        w.image_name AS wrestler_image,
        COUNT(*) AS reigns,
        SUM(
            DATEDIFF(
                COALESCE(r.lost_date, CURDATE()),
                r.won_date
            )
        ) AS total_days
    FROM (
        SELECT id, wrestler_id, won_date, lost_date
        FROM championship_reigns

        UNION ALL

        SELECT id, partner AS wrestler_id, won_date, lost_date
        FROM championship_reigns
        WHERE partner IS NOT NULL
    ) r
    INNER JOIN wrestler w ON w.id = r.wrestler_id
    GROUP BY w.id, w.name
    ORDER BY reigns DESC, total_days DESC;` as {
        wrestler_id: number;
        name: string;
        wrestler_image: string;
        reigns: number;
        total_days: number;
    }[];

    return {
        rankings: list.map(r => ({
            wrestler_id: Number(r.wrestler_id),
            name: r.name,
            wrestler_image: r.wrestler_image,
            reigns: Number(r.reigns),
            total_days: Number(r.total_days),
            calculated_time: Number(r.total_days).getEllapsedTimeFromDays()
        }))
    };
};
