import type { ChampionshipReign, Team, Wrestler } from '@prisma/client';

type ReignName = ChampionshipReign & { Wrestler: Wrestler } & { Team: Team } & {
	Partner: Wrestler;
};

export const ReignUtils = {
	getDaysAndMonths: (days: number): string => {
		const months = Math.floor(days / 30);

		if (days >= 365) {
			const years = Math.floor(days / 365);
			const months = Math.floor((days - years * 365) / 30);
			const yeardays = Math.abs(days - years * 365 - months * 30);

			if (months === 0) return `${years} años y ${yeardays} días`;
			return `${years} años, ${months} meses y ${yeardays} días`;
		}

		if (months === 0) {
			return `${days} días`;
		}

		return `${months} meses y ${Math.abs(days - months * 30)} días`;
	},
	getDaysBetweenDates: (date1: Date, date2: Date): number => {
		const diffTime = Math.abs(date2.getTime() - date1.getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	},
	getWrestlerOrTeamName: (reign: ReignName): string => {
		if (reign.team_id) return reign.Team.name;
		if (reign.partner) {
			return `${reign.Wrestler.name} & ${reign.Partner.name}`;
		}
		return reign.Wrestler.name;
	}
};
