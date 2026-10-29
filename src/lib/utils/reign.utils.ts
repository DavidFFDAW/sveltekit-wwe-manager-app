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
		if (reign.defences === null) return 'Sin defensas';
		const lostDate = reign.lost_date ? reign.lost_date : new Date();
		const days = Math.floor(Math.abs(reign.won_date.getTime() - lostDate.getTime()) / (1000 * 60 * 60 * 24));
		if (days <= 15) return 'Reciente';
		const months = Math.max(days / 30, 1);
		const ritmo = reign.defences / months;
		const rating = Math.floor(Math.min(10, 6 * ritmo));

		if (rating == 0) return 'Nefasto';
		if (rating == 1) return 'Muy malo';
		if (rating == 2) return 'Malo';
		if (rating < 3) return 'Regular';
		if (rating < 5) return 'Buena';
		if (rating < 7) return 'Muy buena';
		return 'Excelente';
	},
};
