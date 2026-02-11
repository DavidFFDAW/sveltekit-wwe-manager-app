import { Helpers } from '$lib/server/server.helpers';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';

export async function POST({ locals }) {
	if (!Helpers.hasPermission(locals, 'admin'))
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	try {
		const repository = new WrestlerRepository();
		const wrestlers = await repository.get({ select: { id: true, name: true } });
		const updatedWrestlers = wrestlers.map((wrestler) => ({
			id: wrestler.id,
			slug: Helpers.slugify(wrestler.name) as string
		}));

		await Promise.all(
			updatedWrestlers.map((wrestler) =>
				repository.updateById(wrestler.id, {
					slug: wrestler.slug
				})
			)
		);
		return Helpers.api.success('Se han actualizado los slugs para todos los posts', 200);
	} catch (error) {
		if (error instanceof Error) return Helpers.api.error(error.message, 500);
		return Helpers.api.error('Un error desconocido ha ocurrido', 500);
	}
}
