import { PUBLIC_VAPID_PUBKEY } from '$env/static/public';
import { HttpService } from '$lib/services/http.service';
import { Utils } from '$lib/utils/general.utils';
import { Toast } from '$lib/utils/toast.helper';

export const subscribe = (userId: number | string | null) => async () => {
	const registration = await navigator.serviceWorker.ready;
	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: Utils.urlBase64ToUint8Array(PUBLIC_VAPID_PUBKEY)
	});
	console.log({ subscription });

	const response = await HttpService.post('/api/push/subscribe', {
		method: 'POST',
		body: JSON.stringify({ subscription: subscription, userId })
	});
	console.log({ response });
	const responseType = response.ok ? 'success' : 'error';
	const responseMessage = response.ok ? 'Subscribed successfully' : 'Failed to subscribe';
	Toast[responseType](responseMessage);
};
