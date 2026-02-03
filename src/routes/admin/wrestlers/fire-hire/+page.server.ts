import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';

const repository = new WrestlerRepository();

export const load = async ({ url }) => {
	const params = url.searchParams;
	const page = parseInt(params.get('page') || '1', 10) || 1;

	const wrestlers = await repository.paginateN(
		page,
		{
			orderBy: { name: 'asc' }
		},
		20
	);
	return { wrestlers, list: wrestlers.list.map((w) => ({ ...w, hired: w.status === 'active' })) };
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const statuses = formData.entries().reduce(
			(acc, [key, value]) => {
				if (key.startsWith('status[') && key.endsWith(']')) {
					const id = key.slice(7, -1);
					if (!['active', 'released'].includes(value.toString())) return acc;
					acc[value.toString()] = acc[value.toString()] || [];
					acc[value.toString()].push(Number(id));
				}
				return acc;
			},
			{} as Record<string, number[]>
		);

		for (const [key, value] of formData.entries()) {
			console.log({ key, value });
		}

		console.log({
			statuses
		});

		return Helpers.success('Estados de contratación actualizados correctamente');
	}
};
