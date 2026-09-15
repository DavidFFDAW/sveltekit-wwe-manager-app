export const DateUtils = {
	getDatetimeFormatted: (date: Date | null): string => {
		if (!date) return '';
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');

		return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	},
	getDaysBetweenDates: (startDate: Date, endDate: Date): number => {
		const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
		return Math.floor(timeDiff / (1000 * 3600 * 24));
	},
	getDateInstanceTimezone: (date: Date, timezone: string = 'Europe/Madrid'): Date => {
		const dateString = date.toLocaleString('en-US', { timeZone: timezone });
		return new Date(dateString);
	},
	getFormatter: (locale: string = 'es-ES', timezone: string = 'Europe/Madrid') => {
		return new Intl.DateTimeFormat(locale, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
			timeZone: timezone,
		});
	},
	format: (date: Date = new Date(), format: string, formatter: Intl.DateTimeFormat | null = null) => {
		const _formatter = formatter ? formatter : DateUtils.getFormatter();
		const parts = _formatter.formatToParts(date);
		const { year, month, day, hour, minute, second } = Object.fromEntries(
			parts.map(p => [p.type, p.value])
		);

		return format.replace('Y', year)
			.replace('m', month)
			.replace('d', day)
			.replace('H', hour)
			.replace('i', minute)
			.replace('s', second)
	}
};

export default DateUtils;
