import type { Championship, ChampionshipReign, Wrestler } from '@prisma/client';

export type UpsertReignView = 'single' | 'team' | 'no-team';

export interface UpserReignChampionship {
    id: number;
    name: string;
    image: string;
    gender: string;
    tag: boolean;
}

export interface UpserReignWrestler {
    id: number;
    name: string;
    image: string;
    gender: string;
    status?: string;
}

export interface UpsertReignsTeamMember {
    id: number;
    name: string;
    image: string | null;
}

export interface UpsertReignTeams {
    id: number;
    name: string;
    image: string | null;
    members: UpsertReignsTeamMember[];
}

export type UpsertReign = ChampionshipReign & {
    Wrestler: Wrestler;
    Partner: Wrestler | null;
    Championship: Championship;
};

export interface ReignUpsertProps {
    reign: UpsertReign;
    championships: UpserReignChampionship[];
    wrestlers: UpserReignWrestler[];
    teams: UpsertReignTeams[];
    ppvs: string[];
}
