import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';

export const load = async () => {
	const wrestlers = await WrestlerDao.filter({
		status: {
			not: {
				in: ['injured', 'released']
			}
		},
		sex: {
			in: ['', 'M', 'm']
		}
	});

	// shuffle the wrestlers array and take only 10 (only for debugging purposes)
	if (import.meta.env.MODE === 'development') {
		return { wrestlers: wrestlers.sort(() => Math.random() - 0.5).slice(0, 10) };
	}

	return { wrestlers };
};

export const actions = {};
