import { PPVDao } from '$lib/server/dao/ppv.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export async function load() {
	return {
		ppvs: await PPVDao.getOrderedPPVs()
	};
}

export const actions = {
	async toggleVisibility({ request, locals }) {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Unauthorized', 401);
		const updatingId = Helpers.getUpdateID(await request.formData());

		try {
			const ppv = await PPVDao.toggleVisibility(updatingId);
			if (!ppv) return Helpers.error('PPV not found', 404);

			return Helpers.success(`${ppv.name} ahora es ${ppv.visible ? 'visible' : 'invisible'}`);
		} catch (error) {
			if (error instanceof Error) return Helpers.error(error.message);
		}
	},
	async toggleActive({ request, locals }) {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Unauthorized', 401);
		const updatingId = Helpers.getUpdateID(await request.formData());

		try {
			const ppv = await PPVDao.toggleActive(updatingId);
			if (!ppv) return Helpers.error('No se ha encontrado el PPV', 404);

			return Helpers.success(
				`${ppv.name} ahora pasa a estar ${ppv.active ? 'activo' : 'inactivo'}`
			);
		} catch (error) {
			if (error instanceof Error) return Helpers.error(error.message);
		}
	},
	async deletePPV({ request, locals }) {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Unauthorized', 401);
		const deletingId = Helpers.getUpdateID(await request.formData());

		try {
			const ppv = await PPVDao.deleteById(deletingId);
			if (!ppv) return Helpers.error('No se ha encontrado el PPV', 404);

			return Helpers.success(`${ppv.name} ha sido eliminado`);
		} catch (error) {
			if (error instanceof Error) return Helpers.error(error.message);
		}
	}
};
