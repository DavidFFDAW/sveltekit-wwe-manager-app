import { WrestlerDao } from '$lib/server/dao/wrestler.dao';

export const load = async () => {
	const wrestlers = await WrestlerDao.filter({
		status: {
			not: {
				in: ['released', 'manager']
			}
		},
		sex: {
			in: ['', 'M', 'm']
		}
	});

	return { elegibleList: wrestlers.sort(() => Math.random() - 0.5) };
};
