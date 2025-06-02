import DatabaseExportUtils from '../../api/export/json/export.core.utils';

export const load = async () => {
    const availableModels = await DatabaseExportUtils.getAllowedModels();
    return { models: availableModels };
};
