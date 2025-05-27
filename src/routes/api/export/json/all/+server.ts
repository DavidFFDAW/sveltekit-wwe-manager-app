import prisma from '$lib/server/prisma.js';
import { Helpers, Api } from '$lib/server/server.helpers.js';

export async function GET({ locals }) {
	if (Helpers.hasPermission(locals))
		return Api.error('You have no permission to access this resource', 403);

	try {
		const [
			users,
			comments,
			blogposts,
			wrestlers,
			wrestlerTeams,
			teams,
			tweets,
			brand,
			championships,
			championship_reigns,
			cronjobs,
			gallery,
			injuries,
			ppvs,
			subscriptions,
			roles,
			user_roles
		] = await Promise.all([
			prisma.user.findMany(),
			prisma.reportComments.findMany(),
			prisma.blogPost.findMany(),
			prisma.wrestler.findMany(),
			prisma.wrestlerTeam.findMany(),
			prisma.team.findMany(),
			prisma.tweets.findMany(),
			prisma.brand.findMany(),
			prisma.championship.findMany(),
			prisma.championshipReign.findMany(),
			prisma.cronjobs.findMany(),
			prisma.gallery.findMany(),
			prisma.injuries.findMany(),
			prisma.pPV.findMany(),
			prisma.subscription.findMany(),
			prisma.roles.findMany(),
			prisma.userRole.findMany()
		]);

		const jsonFile = new Blob(
			[
				JSON.stringify(
					{
						users,
						comments,
						blogposts,
						wrestlers,
						wrestlerTeams,
						teams,
						tweets,
						brand,
						championships,
						championship_reigns,
						cronjobs,
						gallery,
						injuries,
						ppvs,
						subscriptions,
						roles,
						user_roles
					},
					null,
					4
				)
			],
			{ type: 'application/json' }
		);

		const response = Api.json({ data: jsonFile, filename: 'all-data.json' });
		response.headers.set('Content-Disposition', 'attachment; filename=database-datas.json');
		return response;
	} catch (error) {
		console.log('Error in GET /api/export/json/all:', error);
		return Api.error('An error occurred while processing your request', 500);
	}
}
