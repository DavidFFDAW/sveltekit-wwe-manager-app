import prisma from '$lib/server/prisma';
import { Api } from '$lib/server/server.helpers.js';

export async function POST({ request }) {
	const auth = request.headers.get('Authorization');
	if (!auth) return Api.error('No tienes permisos para hacer eso', 403);
	if (auth !== `Bearer ${process.env.CRONJOB_TOKEN}`)
		return Api.error('No tienes permisos para hacer eso', 403);

	try {
		await prisma.championshipReign.updateMany({
			where: {
				AND: [{ lost_date: null }, { current: true }, { won_date: { lte: new Date() } }]
			},

			data: {
				days: {
					increment: 1
				}
			}
		});

		Api.success('Championship reigns updated', 200);
	} catch (error) {
		console.error(error);
		return Api.error('Error updating championship reigns', 500);
	}
}
