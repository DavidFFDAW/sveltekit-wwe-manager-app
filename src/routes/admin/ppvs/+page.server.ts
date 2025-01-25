import prisma from '$lib/server/prisma';
import { Helpers } from '$lib/server/server.helpers.js';

export async function load() {
	return {
		ppvs: await prisma.pPV.findMany({
			orderBy: {
				game_date: 'desc'
			}
		})
	};
}

export const actions = {
	async default({ request }) {
		const formData = await request.formData();
		const ppv = Object.fromEntries(formData);
		console.log({
			ppv,
			statuses: formData.getAll('status')
		});

		await new Promise((resolve) => setTimeout(resolve, 2000));

		return Helpers.error('Error al intentar crear recurso PPV', 500);
		throw new Error('test error');

		return {
			status: 303,
			message: 'PPV created'
		};
	}
};
