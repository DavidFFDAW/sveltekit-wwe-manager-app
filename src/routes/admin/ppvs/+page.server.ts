import prisma from '$lib/server/prisma';

export async function load() {
	return {
		ppvs: await prisma.ppv.findMany({
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

		await new Promise((resolve) => setTimeout(resolve, 5000));

		throw new Error('test error');

		return {
			status: 303,
			message: 'PPV created'
		};
	}
};
