import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';

export const load = async () => {
	const wrestlers = await WrestlerDao.filter({
		status: 'active',
		sex: {
			in: ['', 'M', 'm']
		}
	});

	return { wrestlers };
};

export const actions = {};
