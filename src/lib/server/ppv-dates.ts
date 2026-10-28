/** Uses UTC calendar fields to keep database dates independent of the server timezone. */
export function nearestSundayInYear(date: Date, year: number): Date {
	const result = new Date(date);
	const month = result.getUTCMonth();
	const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	// Clamp February 29 before finding Sunday in non-leap years.
	result.setUTCFullYear(year, month, Math.min(result.getUTCDate(), lastDay));
	const weekday = result.getUTCDay();
	result.setUTCDate(result.getUTCDate() + (weekday <= 3 ? -weekday : 7 - weekday));
	// Keep boundary dates inside the target year.
	if (result.getUTCFullYear() < year) result.setUTCDate(result.getUTCDate() + 7);
	if (result.getUTCFullYear() > year) result.setUTCDate(result.getUTCDate() - 7);
	return result;
}
