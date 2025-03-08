import prisma from '$lib/server/prisma.js';
import { Helpers } from '$lib/server/server.helpers.js';

export async function load({ locals }) {
	if (!Helpers.hasPermission(locals)) return Helpers.redirection('/admin');

	return {
		subscriptions: await prisma.subscription.findMany()
	};
}
