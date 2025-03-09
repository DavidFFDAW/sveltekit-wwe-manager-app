<script lang="ts">
	import { PUBLIC_VAPID_PUBKEY } from '$env/static/public';
	import { HttpService } from '$lib/services/http.service';
	import { Utils } from '$lib/utils/general.utils';
	import { Toast } from '$lib/utils/toast.helper';
	import type { User } from '@prisma/client';
	import { onMount } from 'svelte';

	export let user: User | null;
	let isPushSubscribed = false;
	let emailSubscription = user?.newsletter_subscription;

	const subscribe = async (event: Event) => {
		event.preventDefault();
		if (!user) return Toast.error('No se puede suscribir sin iniciar sesión');
		const userId = user.id;
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

	onMount(async () => {
		const serviceWorker = await navigator.serviceWorker.ready;
		const subscriptions = await serviceWorker.pushManager.getSubscription();
		const hasAllowedNotifications = Notification.permission === 'granted';
		isPushSubscribed = subscriptions !== null && hasAllowedNotifications;
	});
</script>

<div class="w1 subscription-block ignore-main-padding">
	{#if isPushSubscribed && emailSubscription}
		<div class="w1 flex center gap-medium">
			<p class="title">¡Gracias por suscribirte a nuestro newsletter!</p>
		</div>
	{:else if user}
		<div class="w1 flex center gap-medium">
			<p>¡Suscríbete a nuestro newsletter para recibir las últimas noticias!</p>
			<button type="button" class="button" on:click={subscribe}> Suscribirme </button>
		</div>
	{:else}
		<div class="w1 flex center gap-medium">
			<p>Para poder suscribirte a nuestro newsletter, inicia sesión.</p>
			<a href="/login?next=/blog" class="button">Iniciar sesión</a>
		</div>
	{/if}
</div>

<style>
	.subscription-block {
		padding: 1rem;
		background-color: #eee;
		color: #000;
		margin-bottom: -50px;
		margin-top: 0px !important;
	}

	.subscription-block .button {
		color: #fff;
		background-color: #000;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
	}

	.subscription-block p.title {
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
	}
</style>
