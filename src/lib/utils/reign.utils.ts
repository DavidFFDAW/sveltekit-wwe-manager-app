import type { ChampionshipReign, Team, Wrestler } from '@prisma/client';

type ReignName = ChampionshipReign & { Wrestler: Wrestler } & { Team: Team } & {
	Partner: Wrestler;
};

const formatReignDays = (days: number): string => {
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
};
const newFormatReigns = (days: number): string => {
	if (days <= 0) {
		const totalSeconds = Math.abs(days * 24 * 60 * 60);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		const datas = [`${hours} horas`, `${minutes} minutos`, `${seconds} segundos`].filter(data => !data.startsWith('0 '));
		return datas.join(', ').replace(/, ([^,]*)$/, ' y $1');
	}

	const years = Math.floor(days / 365);
	const months = Math.floor((days - years * 365) / 30);
	const yeardays = Math.abs(days - years * 365 - months * 30);
	const datas = [`${years} años`, `${months} meses`, `${yeardays} días`].filter(data => !data.startsWith('0 '));
	return datas.join(', ').replace(/, ([^,]*)$/, ' y $1');
};

export const ReignUtils = {
	formatReignDays: newFormatReigns,
	getDaysAndMonths: newFormatReigns,
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
	},
	getReignRankingStatus: (reign: ChampionshipReign): string => {
		// aqui analizaremos la cantidad de dias que lo ha tenido, para asignar un tag según acredite.
		// lo normal es defender el campeonato, al menos una vez cada mes. Se tendrá esto en cuenta para asignar un label
		if (reign.defences === 0) return 'terrible';
		return '';
	},
};
