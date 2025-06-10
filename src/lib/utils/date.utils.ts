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
	}
};

export default DateUtils;
