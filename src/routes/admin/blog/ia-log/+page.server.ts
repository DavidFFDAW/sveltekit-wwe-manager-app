import { Helpers } from '$lib/server/server.helpers';
import { IaRepository } from '$lib/server/dao/repositories/ia.repository.js'

type LogEntry = {
	model: string;
	date: string;
	tokens: number;
}


export const load = async ({ url }) => { 
	const logs = new IaRepository();
	const searchPagination = Helpers.getPaginationFromSearchParams(url.searchParams);
	const connection = await logs.conn();
	
	const today = new Date();
	const start = today.toISOString().slice(0, 10) + ' 00:00:00';
	const end = today.toISOString().slice(0, 10) + ' 23:59:59';
	const dates: string[] = await connection.$queryRaw`SELECT DISTINCT(DATE(created_at)) AS dates FROM ia_log ORDER BY created_at DESC`;
	const usage: LogEntry[] = await connection.$queryRaw`SELECT model, DATE(created_at) AS \`date\`, SUM(total_tokens) AS tokens FROM ia_log WHERE created_at > ${start} AND created_at < ${end} GROUP BY model, DATE(created_at) ORDER BY created_at DESC, model ASC`;
	const cleanedUsage = usage.map((entry: any) => ({
		model: entry.model,
		date: entry.date.toISOString().slice(0, 10),
		tokens: Number(entry.tokens)
	})) as LogEntry[];

	return {
		ia: {
			dates: dates.map((d: any) => d.dates.toISOString().slice(0, 10)),
			usage: cleanedUsage,
		}
	}
}