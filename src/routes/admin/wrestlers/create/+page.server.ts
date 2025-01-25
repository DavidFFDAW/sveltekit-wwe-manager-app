// import { Helpers } from '$lib/server/server.helpers';

import { WrestlerDao } from '$lib/server/dao/wrestler.dao';
import { Helpers } from '$lib/server/server.helpers.js';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const { error, message } = Helpers.checkRequiredFields(formData, WrestlerDao.required);
		if (error) return Helpers.error(message);

		const wrestlerObject = WrestlerDao.transformToWrestlerObject(formData);
		try {
			const updatedWrestler = await WrestlerDao.createWrestler(wrestlerObject);
			if (updatedWrestler) return Helpers.success('Luchador actualizado correctamente');
		} catch (error: unknown) {
			console.log(typeof error);
			if (error instanceof Error) return Helpers.error(`Error:: ${error.message}`, 500);
		}
		return Helpers.error('No implementado');
	}
};
