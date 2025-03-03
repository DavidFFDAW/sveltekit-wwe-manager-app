import prisma from '$lib/server/prisma.js';
import { Helpers } from '$lib/server/server.helpers.js';

export async function POST({ request }) {
	const { subscription } = await request.json();
	const { p256dh, auth } = subscription.keys;
	// Guardar en la base de datos
	await prisma.subscription.create({
		data: {
			endpoint: subscription.endpoint,
			p256dh: p256dh,
			auth: auth,
			expiration: subscription.expirationTime
		}
	});

	return Helpers.apiResponse({ message: 'Suscrito correctamente' });
}
