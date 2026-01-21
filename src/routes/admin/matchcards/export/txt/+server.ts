import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository';
import { Helpers } from '$lib/server/server.helpers';

export const GET = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id || isNaN(Number(id))) return Helpers.api.error('ID inválido o no proporcionado', 400);

	const matchCardRepository = new PpvCardRepository();
	const matchCardEvent = await matchCardRepository.getMatchCardWithMatches(id);
	if (!matchCardEvent) return Helpers.api.error('Evento no encontrado', 404);

	const randomUuid = crypto.randomUUID().split('-')[0];
	const date = matchCardEvent.ppv_date ? matchCardEvent.ppv_date.toISOString().split('T')[0] : '';
	const file = `${randomUuid}-${matchCardEvent.ppv_name}_${date}.csv`;
	const headers = new Headers({
		'Content-Disposition': `attachment; filename="${file}"`,
		'Content-Type': 'text/csv'
	});

	const csvHeader = ['stipulation', 'championship', 'participants', 'winner', 'night', 'rating'];
	let csvContent = csvHeader.join(';') + '\n';

	if ('matches' in matchCardEvent && matchCardEvent.matches.length > 0) {
		for (const match of matchCardEvent.matches) {
			const row = [
				`"${match.stipulation ?? ''}"`,
				`"${match.championship ?? ''}"`,
				`"${match.participants ?? ''}"`,
				`"${match.winner ?? ''}"`,
				'',
				`${match.rating ?? ''}`
			];
			csvContent += row.join(';') + '\n';
		}
	}

	return new Response(csvContent, { headers });
};
