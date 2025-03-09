import { UsersDao } from '$lib/server/dao/users.dao.js';
import prisma from '$lib/server/prisma.js';
import { Helpers } from '$lib/server/server.helpers.js';

export async function POST({ request }) {
	const { subscription, userId } = await request.json();
	if (!subscription) return Helpers.apiResponseMessage('No se ha recibido la suscripción', 400);
	if (!userId) return Helpers.apiResponseMessage('No se ha recibido el ID del usuario', 400);

	const { p256dh, auth } = subscription.keys;
	const userAgent = (request.headers.get('user-agent') as string) || '';
	const device = userAgent.match(/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/i)
		? 'mobile'
		: 'desktop';

	// Guardar en la base de datos
	await prisma.subscription.create({
		data: {
			endpoint: subscription.endpoint,
			p256dh: p256dh,
			auth: auth,
			expiration: subscription.expirationTime,
			device: device,
			user_agent: userAgent,
			user_id: userId
		}
	});

	await UsersDao.subscribeUser(Number(userId));

	return Helpers.apiResponse({ message: 'Suscrito correctamente' });
}
