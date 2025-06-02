import { Api } from '$lib/server/server.helpers.js';
import DatabaseExportUtils from '../export.core.utils.js';

export async function GET() {
    const models = DatabaseExportUtils.getManuallyExportModels();

    try {
        const databaseTableInfo = await Promise.all(
            models.map(async model => ({
                modelName: model,
                datas: await DatabaseExportUtils.getDatabaseTableInfo(model),
            })),
        );

        let sqlContent = '';
        for (const tableInfo of databaseTableInfo) {
            const tableName = tableInfo.modelName;
            sqlContent += `-- Table: ${tableName}\n`;
            const databaseCreateSQL = DatabaseExportUtils.getCreateTableQuery(tableName, tableInfo.datas);
            sqlContent += databaseCreateSQL + '\n\n';
        }

        console.log(`Exporting ${databaseTableInfo.length} tables to SQL format.`);
        console.log(sqlContent);

        const fileName = `databases-export-${Date.now()}.sql`;
        return DatabaseExportUtils.getFileSqlResponse(sqlContent, fileName);
    } catch (error) {
        console.log('Error in GET /api/export/json/all:', error);
        return Api.error('An error occurred while processing your request', 500);
    }
}
