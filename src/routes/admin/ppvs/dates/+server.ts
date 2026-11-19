import { ppv } from '$lib/server/dao/repositories/ppv.repository';
import { Helpers } from '$lib/server/server.helpers';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	try {
		const updated = await ppv.updatePastPpvDates();
		return Helpers.api.success(`Fechas de PPV actualizadas: ${updated}`);
	} catch (error) {
		console.error(error);
		return Helpers.api.error('Error al actualizar las fechas de los PPV', 500);
	}
};
