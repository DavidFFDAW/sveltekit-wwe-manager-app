import prisma from '$lib/server/prisma.js';
import { Helpers } from '$lib/server/server.helpers.js';

export async function POST({ locals }) {
	if (!Helpers.hasPermission(locals))
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	// update championship brands
	// update wrestler brands
	// update team brands
	await Promise.all([
		prisma.championship.updateMany({
			data: { brand: 'raw' },
			where: { brand: 'RAW' }
		}),
		prisma.championship.updateMany({
			data: { brand: 'smackdown' },
			where: { brand: 'SD' }
		}),
		prisma.wrestler.updateMany({
			data: { brand: 'awl' },
			where: { brand: 'AWL' }
		}),
		prisma.wrestler.updateMany({
			data: { brand: 'all' },
			where: { brand: 'ALL' }
		})
	]);

	return Helpers.apiResponseMessage('Títulos actualizados', 200);
}
