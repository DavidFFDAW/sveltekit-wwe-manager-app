import prisma from '$lib/server/prisma.js';
import { Api } from '$lib/server/server.helpers.js';
import DatabaseExportUtils from '../../../json/export.core.utils.js';

export async function GET({ params }) {
    const { model } = params;

    try {
        // List allowed model names as keys of prisma
        const allowedModels = DatabaseExportUtils.getAllowedModels();
        if (!allowedModels.includes(model)) return Api.error('Model not found', 404);

        const prismaModel = (prisma as Record<string, any>)[model];
        if (!prismaModel) return Api.error('Model not found', 404);

        const modelTableName = prismaModel._meta?.tableName || model;
        const allTableRecords = await prismaModel.findMany({
            orderBy: { id: 'asc' },
        });
        const fileName = `database-datas-export-${modelTableName}.sql`;
        const parsedSQLContent = DatabaseExportUtils.recordsToSqlInsertStatements(allTableRecords, modelTableName);
        return DatabaseExportUtils.getFileSqlResponse(parsedSQLContent, fileName);
        // return Api.error('Exporting SQL files is not supported in this version', 501);
    } catch (error) {
        console.log(`Error exporting data for model ${model}:`, error);
        return Api.error('Failed to export data', 500);
    }
}
