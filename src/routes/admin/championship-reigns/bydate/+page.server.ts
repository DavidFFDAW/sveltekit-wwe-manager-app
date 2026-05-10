import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository.js';
import { Utils } from '$lib/utils/general.utils';

type DBReign = {
    id: number;
    days: number;
    current: boolean;
    won_date: Date;
    lost_date: Date | null;
    wid: number;
    wname: string;
    wimage: string;
    pid: number | null;
    pname: string | null;
    pimage: string | null;
    cid: number;
    cname: string;
    ctag: string;
    cimage: string;
    tname: string | null;
}

export const load = async ({ url }) => {
    const today = new Date();
    const date = url.searchParams.get('date');

    const reigns = new ReignsRepository();
    const currentDate = date ? new Date(date) : today;
    const dateISO = currentDate.toISOString().split('T')[0];
    const conn = reigns.conn();

    const mindateSQL = await conn.$queryRaw<{ min: Date }[]>`SELECT MIN(won_date) AS min FROM championship_reigns LIMIT 1`;
    const mindate: Date = mindateSQL[0].min;

    const currentDateReigns = await conn.$queryRaw<DBReign[]>`SELECT r.id, r.days, r.current, r.won_date, r.lost_date, w.id AS wid, w.name AS wname, w.image_name AS wimage, p.id AS pid, p.name AS pname, p.image_name AS pimage, c.id AS cid, c.name AS cname, c.tag AS ctag, c.image AS cimage, t.name AS tname FROM championship_reigns r INNER JOIN wrestler w ON w.id = r.wrestler_id LEFT JOIN wrestler p ON p.id = r.partner INNER JOIN championship c ON c.id = r.championship_id LEFT JOIN teams t ON t.id = r.team_id WHERE r.won_date <= ${dateISO} AND(r.lost_date IS NULL OR r.lost_date >= ${dateISO}) AND can_stats_count = true`;
    const parsedCurrentDateReigns = currentDateReigns.map((reign) => {
        return {
            id: Number(reign.id),
            days: Number(reign.days),
            current: Boolean(reign.current),
            won_date: new Date(reign.won_date),
            lost_date: reign.lost_date ? new Date(reign.lost_date) : null,
            formatted_won_date: Utils.formatDate(reign.won_date),
            formatted_lost_date: reign.lost_date ? Utils.formatDate(reign.lost_date) : null,
            wrestler: {
                id: Number(reign.wid),
                name: reign.wname,
                image: reign.wimage,
            },
            partner: {
                id: reign.pid ? Number(reign.pid) : null,
                name: reign.pname,
                image: reign.pimage,
            },
            championship: {
                id: Number(reign.cid),
                name: reign.cname,
                image: reign.cimage,
                tag: reign.ctag,
            },
            team: reign.tname || '',
        };
    });

    return {
        reigns: {
            currentDate,
            currentDateISO: dateISO,
            minDateISO: mindate.toISOString().split('T')[0],
            maxDateISO: today.toISOString().split('T')[0],
            currentDateFormatted: Utils.formatDate(currentDate),
            currentDateReigns: parsedCurrentDateReigns
        }
    };
}