import { IaRepository } from '$lib/server/dao/repositories/ia.repository.js'

type LogEntry = {
	model: string;
	date: string;
	text: string;
	tokens: number;
}


export const load = async ({ url }) => {
	const logs = new IaRepository();
	const connection = logs.conn();
	const filterDate = url.searchParams.get('date')?.replace(/\//g, '-');
	
	const dates: { dates: Date }[] = await connection.$queryRaw`SELECT DISTINCT(DATE(created_at)) AS dates FROM ia_log ORDER BY dates ASC`;
	const cleanedDates = dates.map(d => ({
		text: d.dates.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
		value: d.dates.toISOString().slice(0, 10)
	}));

	const lastDate = cleanedDates[cleanedDates.length - 1]?.value;
	
	const today = filterDate ? new Date(filterDate) : new Date(lastDate);
	const start = today.toISOString().slice(0, 10) + ' 00:00:00';
	const end = today.toISOString().slice(0, 10) + ' 23:59:59';

	const usage: any = await connection.$queryRaw`SELECT model, DATE(created_at) AS created, SUM(total_tokens) AS tokens FROM ia_log WHERE created_at > ${start} AND created_at < ${end} GROUP BY model, DATE(created_at) ORDER BY created DESC, model ASC`;
	const cleanedUsage = usage.map((entry: any) => ({
		model: entry.model,
		date: entry.created.toISOString().slice(0, 10),
		text: entry.created.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
		tokens: Number(entry.tokens)
	})) as LogEntry[];

	


	return {
		ia: {
			usage: cleanedUsage,
			dates: cleanedDates,
			totalTokens: cleanedUsage.reduce((total, log) => total + log.tokens, 0),
			currentDate: today.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
		}
	}
}