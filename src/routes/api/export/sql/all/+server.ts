import { Api } from '$lib/server/server.helpers.js';
import { table } from 'console';
import DatabaseExportUtils from '../../json/export.core.utils.js';

export async function GET() {
	const models = DatabaseExportUtils.getAllowedModels();
	try {
		const allTableRows = await Promise.all(
			models.map(async (model) => {
				const prisma = DatabaseExportUtils.getPrismaModel(model);
				const tableDictionary = DatabaseExportUtils.getDatabaseMappingsDictionary();
				const modelTableName = tableDictionary[model.toLowerCase()] || model;
				console.log({ modelTableName });

				return {
					modelName: model,
					datas: await prisma.findMany(),
					table: modelTableName
				};
			})
		);

		let sqlContent = '';
		for (const tableRows of allTableRows) {
			const tableName = tableRows.table;
			sqlContent += `-- Table: ${tableName}\n`;
			const insertValues = DatabaseExportUtils.recordsToSqlInsertStatements(
				tableRows.datas,
				tableName
			);

			if (!insertValues || insertValues.length === 0) {
				console.log(`No data found for table ${tableName}. Skipping...`);
				continue;
			}

			sqlContent += insertValues + '\n\n\n';
		}

		const fileName = `databases-export-${Date.now()}.sql`;
		return DatabaseExportUtils.getFileSqlResponse(sqlContent, fileName);
	} catch (error) {
		console.log('Error in GET /api/export/json/all:', error);
		return Api.error('An error occurred while processing your request', 500);
	}
}
