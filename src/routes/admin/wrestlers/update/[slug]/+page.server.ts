import prisma from '$lib/server/prisma.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const { slug } = params;
	if (!slug || isNaN(Number(slug))) throw redirect(302, '/admin/wrestlers');

	const wrestler = await prisma.wrestler.findUnique({
		where: { id: Number(slug) }
	});

	return { wrestler, slug };
};

export const actions = {
	update: async ({ request }) => {
		const datas = await request.formData();
		console.log(Object.fromEntries(datas));
	}
};
