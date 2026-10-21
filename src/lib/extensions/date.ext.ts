import { defineExtension } from './define';

defineExtension(Date.prototype, 'getCustomIsoFormat', function (this: Date) {
	return this.toLocaleString('sv-SV', {
		hour12: false,
		timeZone: 'Europe/Madrid'
	});
});
defineExtension(Date.prototype, 'getEllapsedTimeBetweenDates', function (this: Date, end: Date | null | undefined = new Date()) {
	const endDate = end ?? new Date();
	const totalSeconds = Math.abs(Math.floor((this.getTime() - endDate.getTime()) / 1000));
	const days = Math.floor(totalSeconds / 86400);

	if (days > 0) {
		const years = Math.floor(days / 365.4);
		const months = Math.floor((days - years * 365) / 30);
		const yeardays = Math.abs(days - years * 365 - months * 30);
		const yearsFormat = [`${years} años`, `${months} meses`, `${yeardays} días`].filter(data => !data.startsWith('0 '));
		return yearsFormat.join(', ').replace(/, ([^,]*)$/, ' y $1');
	}

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	const hoursFormat = [`${hours} horas`, `${minutes} minutos`, `${seconds} segundos`].filter(data => !data.startsWith('0 '));
	return hoursFormat.join(', ').replace(/, ([^,]*)$/, ' y $1');
});
