import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const id = params.slug;
	if (!id || isNaN(Number(id))) return Helpers.api.error('ID inválido o no proporcionado', 400);

	const matchCardRepository = new PpvCardRepository();
	const matchCardEvent = await matchCardRepository.getRow({
		where: { id: Number(id) },
		include: {
			matches: true
		}
	});

	if (!matchCardEvent) return Helpers.api.error('Evento no encontrado', 404);

	const json = JSON.stringify(matchCardEvent);
	const filename = `matchcard-event-${matchCardEvent.ppv_name
		.toLowerCase()
		.replace(/\s+/g, '-')}-${matchCardEvent.id}.json`;
	const headers = new Headers({
		'Content-Disposition': `attachment; filename="${filename}"`,
		'Content-Type': 'application/json'
	});

	return new Response(json, { headers });
};
