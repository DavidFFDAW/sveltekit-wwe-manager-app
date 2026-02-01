import { VAPID_EMAIL, VAPID_PRIVKEY } from '$env/static/private';
import { PUBLIC_VAPID_PUBKEY } from '$env/static/public';
import webpush from 'web-push';

export type PushSubscription = {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
};

export const PushService = {
	getConfiguredPush() {
		webpush.setVapidDetails(`mailto:${VAPID_EMAIL}`, PUBLIC_VAPID_PUBKEY, VAPID_PRIVKEY);
		return webpush;
	},
	sendNotification(subscription: PushSubscription, payload: string | object) {
		const payloadData = typeof payload === 'object' ? JSON.stringify(payload) : payload;
		return webpush.sendNotification(subscription, payloadData);
	}
};
export default PushService;
