import type { Prisma } from '@prisma/client';

export interface CommonDatas {
    type: string;
    championship: {
        id: number;
        name: string;
    };
    wrestler: {
        id: number;
        name: string;
    };
    team: {
        id: number;
        members: string[];
        wrestler: number | null;
        partner: number | null;
    };
    no_team: {
        members: {
            ids: string[];
            members: string[];
            names: string[];
        };
    };
    days: number;
    current: boolean;
    show_won: string | null;
    victory_way: string;
    date_won: Date;
    date_lost: Date | null;
}

export const ReignsAdapter = {
    getCommonDatas: (form: FormData): CommonDatas => {
        const type = form.get('reign-type');
        const lostDate = form.get('lost_date') ? new Date(form.get('lost_date') as string) : null;

        const baseDatas = {
            type: type ? (type as string) : 'single',
            championship: {
                id: Number(form.get('selected-championship-reign-resource-id')),
                name: form.get('selected-championship-reign-resource-name') as string,
            },
            wrestler: {
                id: Number(form.get('selected-wrestler-reign-resource-id')),
                name: form.get('selected-wrestler-reign-resource-name') as string,
            },
            team: {
                id: Number(form.get('tag-team-reign-selected-team')),
                members: form.getAll('tag-team-reign-team-members[]') as string[],
                wrestler: form.get('tag-team-reign-team-wrestler-champion')
                    ? Number(form.get('tag-team-reign-team-wrestler-champion'))
                    : null,
                partner: form.get('tag-team-reign-team-wrestler-partner')
                    ? Number(form.get('tag-team-reign-team-wrestler-partner'))
                    : null,
            },
            no_team: {
                members: {
                    ids: form.getAll('team-single-member-selector-id[]') as string[],
                    members: form.getAll('selected-team-member[]') as string[],
                    names: form.getAll('team-single-member-selector-name[]') as string[],
                },
            },
            days: form.get('days') ? Number(form.get('days')) : 0,
            current: lostDate ? false : true,
            show_won: form.get('show_won') ? (form.get('show_won') as string) : null,
            victory_way: (form.get('victory_way') as string) || 'Pinfall',
            date_won: new Date(form.get('won_date') as string),
            date_lost: lostDate,
        };

        return baseDatas;
    },
    getReignObject: (datas: CommonDatas): Prisma.ChampionshipReignUncheckedCreateInput => {
        if (datas.type === 'team') {
            if (!datas.team.wrestler || !datas.team.partner) throw new Error('No members in team');
            return {
                championship_id: datas.championship.id,
                team_id: datas.team.id,
                wrestler_id: datas.team.wrestler,
                partner: datas.team.partner,
                days: datas.days,
                current: datas.current,
                ppv_won: datas.show_won,
                victory_way: datas.victory_way,
                won_date: datas.date_won,
                lost_date: datas.date_lost,
            };
        }
        if (datas.type === 'no-team') {
            if (datas.no_team.members.ids.length < 2) throw new Error('No members in team');
            return {
                team_id: null,
                championship_id: datas.championship.id,
                wrestler_id: Number(datas.no_team.members.ids[0]),
                partner: Number(datas.no_team.members.ids[1]),
                days: datas.days,
                current: datas.current,
                ppv_won: datas.show_won,
                victory_way: datas.victory_way,
                won_date: datas.date_won,
                lost_date: datas.date_lost,
            };
        }
        // only when type is single or empty
        return {
            team_id: null,
            championship_id: datas.championship.id,
            wrestler_id: datas.wrestler.id,
            days: datas.days,
            current: datas.current,
            ppv_won: datas.show_won,
            victory_way: datas.victory_way,
            won_date: datas.date_won,
            lost_date: datas.date_lost,
        };
    },
};
