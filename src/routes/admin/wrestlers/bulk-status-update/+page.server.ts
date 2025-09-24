import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository';
import { Helpers } from '$lib/server/server.helpers';

export async function load({ url }) {
	const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page') as string) : 1;
	const perPage = url.searchParams.get('perPage')
		? parseInt(url.searchParams.get('perPage') as string)
		: 20;

	const wrestlerRepo = new WrestlerRepository();
	const wrestlers = await wrestlerRepo.paginate(page, {}, perPage);

	return {
		wrestlers: wrestlers[1],
		total: wrestlers[0],
		page,
		perPage
	};
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		try {
			const status = formData.get('_status') as string;
			const activeIds = formData.getAll('activeIds') as string[];
			const numericActiveIds = activeIds.map((id) => parseInt(id, 10));
			if (!status || numericActiveIds.length === 0)
				return Helpers.error('No se proporcionaron datos válidos', 400);

			const wrestlerRepo = new WrestlerRepository();
			await wrestlerRepo.bulkUpdate(
				{
					id: { in: numericActiveIds }
				},
				{ status }
			);
			return Helpers.success('Estados de luchadores actualizados correctamente');
		} catch (error) {
			console.error('Error updating wrestlers status:', error);
			return Helpers.error('Error actualizando los estados de los luchadores', 500);
		}
	}
};
