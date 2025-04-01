import type { Team, Wrestler, WrestlerTeam } from '@prisma/client';
export type UpsertTeam = Team & { WrestlerTeam: WrestlerTeam[] } & { members: Wrestler[] };
