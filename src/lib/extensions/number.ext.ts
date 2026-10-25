import { defineExtension } from './define';

defineExtension(Number.prototype, 'getEllapsedTimeFromDays', function (this: Number) {
    const days = Number(this);

    if (days <= 0)
        return { days, formatted: 'Menos de 1 día' };

    const years = Math.floor(days / 365.4);
    const months = Math.floor((days - years * 365) / 30);
    const yeardays = Math.abs(days - years * 365 - months * 30);
    const yearsFormat = [`${years} años`, `${months} meses`, `${yeardays} días`].filter(data => !data.startsWith('0 '));
    return { days, formatted: yearsFormat.join(', ').replace(/, ([^,]*)$/, ' y $1') }
});
