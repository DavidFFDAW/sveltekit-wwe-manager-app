import type { Match } from '@prisma/client';
export type MatchItem = Match & { inner_identifier?: number };
