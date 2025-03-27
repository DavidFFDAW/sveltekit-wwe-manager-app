import { PPVDao } from '$lib/server/dao/ppv.dao.js';
import { Helpers, Api } from '$lib/server/server.helpers.js';

export async function POST({ locals }) {
	if (!Helpers.hasPermission(locals)) return Api.error('Unauthorized', 401);
	const year = new Date().getFullYear();

	try {
		await PPVDao.updateAllPPVYearDate(year);
		return Api.success('Se ha actualizado la fecha de todos los PPVs activos', 200);
	} catch (error) {
		console.error(error);
		return Api.error('Error updating PPVs year date', 500);
	}
}
