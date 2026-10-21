import prisma from '$lib/server/prisma';
import { Helpers } from '$lib/server/server.helpers';

export const load = async ({ params }) => {
	const id = Number(params.id);
	if (!id || isNaN(id)) return Helpers.redirection('/admin/wrestlers');

	const Wrestler = prisma.wrestler;
	const Reigns = prisma.championshipReign;

	const wrestlerReigns = await Reigns.findMany({
		where: {
			OR: [
				{
					wrestler_id: id
				},
				{
					partner: id
				}
			]
		},
		include: {
			Championship: true,
			Team: true
		},
		orderBy: {
			won_date: 'desc'
		}
	});

	return {
		wrestlerReigns
	};
}