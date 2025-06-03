import prisma from '$lib/server/prisma';
import DateUtils from '$lib/utils/date.utils';
import { Prisma } from '@prisma/client';

export interface DatabaseTableDatas {
	Field: string;
	Type: string;
	Null: string;
	Key: string;
	Default: string | null;
	Extra: string | null;
}

export const DatabaseExportUtils = {
	getManuallyExportModels: () => [
		'users',
		'user_comments',
		'news',
		'wrestler',
		'wrestler_team',
		'teams',
		'tweets',
		'brands',
		'championship',
		'championship_reigns',
		'cronjobs',
		'gallery',
		'injuries',
		'ppv',
		'subscriptions',
		'roles',
		'user_role'
	],
	getDatabaseMappingsDictionary: (): Record<string, string> => {
		return {
			user: 'users',
			reportcomments: 'user_comments',
			blogpost: 'news',
			wrestler: 'wrestler',
			wrestlerteam: 'wrestler_team',
			team: 'teams',
			tweets: 'tweets',
			brands: 'brands',
			championship: 'championship',
			championshipreign: 'championship_reigns',
			cronjobs: 'cronjobs',
			gallery: 'gallery',
			injuries: 'injuries',
			ppv: 'ppv',
			subscription: 'subscriptions',
			roles: 'roles',
			userrole: 'user_role'
		};
	},
	getAllowedModels: () =>
		Object.keys(prisma).filter((key) => !key.startsWith('_') && !key.startsWith('$')),
	getDatabaseTableInfo: (modelTableName: string): Promise<DatabaseTableDatas[]> => {
		return prisma.$queryRaw`SHOW COLUMNS FROM ${Prisma.raw(modelTableName)}`;
	},
	getPrismaModel: (modelTableName: string): any => {
		const prismaModel = (prisma as Record<string, any>)[modelTableName];
		if (!prismaModel) throw new Error(`Model ${modelTableName} does not exist in Prisma schema.`);
		return prismaModel;
	},
	getTableRows: (modelTableName: string): Promise<any[]> => {
		const prismaModel = (prisma as Record<string, any>)[modelTableName];
		if (!prismaModel) throw new Error(`Model ${modelTableName} does not exist in Prisma schema.`);
		return prismaModel.findMany();
	},
	getCreateTableQuery: (modelTableName: string, structure: DatabaseTableDatas[]): string => {
		return (
			structure.reduce((query, col) => {
				const isLastColumn = structure.indexOf(col) === structure.length - 1;
				const type = col.Type.replace(/unsigned|zerofill/g, '').trim();
				const defaultValueParsed = type.includes('int')
					? col.Default
					: type.includes('char')
						? `'${col.Default}'`
						: col.Default;
				const nullability = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
				const defaultValue = col.Default !== null ? `DEFAULT ${defaultValueParsed}` : '';
				const extra = col.Extra
					? ` ${col.Extra} ${isLastColumn ? '' : ','}`
					: isLastColumn
						? ''
						: ',';
				return `${query} \`${col.Field}\` ${type} ${nullability} ${defaultValue}${extra}\n`;
			}, `CREATE TABLE IF NOT EXISTS ${modelTableName} (\n`) + ');'
		);
	},
	getFileSqlResponse: (sqlContent: string, fileName: string): Response => {
		return new Response(sqlContent, {
			headers: {
				'Content-Disposition': `attachment; filename="${fileName}"`,
				'Content-Type': 'application/sql',
				'Content-Length': Buffer.byteLength(sqlContent).toString()
			}
		});
	},
	recordsToSqlInsertStatements: (records: any[], tableName: string): string => {
		if (!records || records.length === 0) return '';
		const columns = Object.keys(records[0]);
		const values = records
			.map((record) => {
				return `(${columns
					.map((col) => {
						const value = record[col];
						if (value === null || value === undefined) return null;
						if (typeof value === 'boolean') return value ? 1 : 0;
						if (typeof value === 'object' && value instanceof Date)
							return `'${DateUtils.getDatetimeFormatted(value)}'`;
						if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
						return value;
					})
					.join(', ')})`;
			})
			.join(',\n');
		return `INSERT INTO ${tableName} (${columns.map((col) => `\`${col}\``).join(', ')}) VALUES\n${values};\n`;
	}
};

export default DatabaseExportUtils;
