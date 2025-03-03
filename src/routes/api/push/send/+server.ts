import { VAPID_EMAIL, VAPID_PRIVKEY } from '$env/static/private';
import { PUBLIC_VAPID_PUBKEY } from '$env/static/public';
import prisma from '$lib/server/prisma.js';
import { Helpers } from '$lib/server/server.helpers.js';
import webpush from 'web-push';

export async function POST({ request, locals }) {
	if (!Helpers.hasPermission(locals, 'admin'))
		return Helpers.apiResponseMessage('Unauthorized', 401);

	const { title, body, url, image } = await request.json();
	const payload = JSON.stringify({ title, body, url, image: image || '' });

	try {
		const subscriptions = await prisma.subscription.findMany();
		if (!subscriptions.length || subscriptions.length <= 0) {
			return Helpers.apiResponseMessage('No subscriptions found', 404);
		}

		webpush.setVapidDetails(`mailto:${VAPID_EMAIL}`, PUBLIC_VAPID_PUBKEY, VAPID_PRIVKEY);
		const notificationsToSend = subscriptions.map(({ endpoint, p256dh, auth }) => {
			const subscription = {
				endpoint,
				keys: { p256dh, auth }
			};
			return webpush.sendNotification(subscription, payload);
		});

		await Promise.all(notificationsToSend);
		return Helpers.apiResponseMessage('Push sent', 200);
	} catch (error) {
		console.error(error);
		return Helpers.apiResponseMessage('Error sending push', 500);
	}
}
