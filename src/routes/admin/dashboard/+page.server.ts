import { PPVDao } from '$lib/server/dao/ppv.dao';

export const load = async () => {
	console.log('dashboard');
	return {
		nextPpv: await PPVDao.getDashboardNextPPV()
	};
};
