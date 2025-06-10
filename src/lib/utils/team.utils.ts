import type { ChampionshipReign, Wrestler, Championship, Team } from '@prisma/client';
export type ChampionshipReignMeta = ChampionshipReign & { Wrestler: Wrestler } & {
	Partner: Wrestler;
} & { Team: Team } & {
	Championship: Championship;
};

export function getWrestlerOrTeamName(
	reign: ChampionshipReignMeta,
	showTeamMembers: boolean = false
) {
	if (!reign.Championship.tag) return reign.Wrestler.name;
	if (reign.Team && showTeamMembers)
		return `${reign.Team.name} (${reign.Wrestler?.name} & ${reign.Partner?.name})`;
	if (reign.Team) return reign.Team.name;
	return `${reign.Wrestler?.name} & ${reign.Partner?.name}`;
}
