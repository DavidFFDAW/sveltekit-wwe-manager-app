import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';

const repository = new WrestlerRepository();

export const load = async ({ url }) => {
	const params = url.searchParams;
	const page = parseInt(params.get('page') || '1', 10) || 1;

	const wrestlers = await repository.paginateN(
		page,
		{
			select: { id: true, name: true, brand: true },
			orderBy: { slug: 'asc' }
		},
		20
	);
	return {
		wrestlers
	};
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const entries = Array.from(formData.entries());
		if (entries.length === 0) return Helpers.error('No se enviaron datos en el formulario');

		try {
			const validBrands = ['raw', 'smackdown', 'awl'];
			const brands = entries.reduce(
				(acc, [key, value]) => {
					if (!key.startsWith('brand[')) return acc;
					if (!validBrands.includes(value.toString())) return acc;

					const id = key.slice('brand['.length, -1);
					acc[value.toString()] = acc[value.toString()] || [];
					acc[value.toString()].push(Number(id));
					return acc;
				},
				{} as Record<string, number[]>
			);

			await Promise.allSettled(
				Object.entries(brands).map(([brand, ids]) => {
					return repository.bulkUpdate({ id: { in: ids } }, { brand });
				})
			);

			return Helpers.success('Géneros actualizados correctamente');
		} catch (error) {
			console.error('Error updating wrestler genders:', error);
			return Helpers.error('Error al actualizar los géneros');
		}
	}
};
