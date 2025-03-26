import { PPVDao } from '$lib/server/dao/ppv.dao.js';

export const load = async () => {
	return { ppvs: await PPVDao.getActivePPVs() };
};
