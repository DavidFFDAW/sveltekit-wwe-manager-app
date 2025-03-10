<script lang="ts">
	import { onMount } from 'svelte';

	interface Notification {
		type: string;
		title: string;
		body: string;
		url: string;
	}

	let notifications: Notification[] = [];

	onMount(async () => {
		if (!('serviceWorker' in navigator)) {
			console.warn('Service Worker not supported');
			return;
		}

		if (navigator.serviceWorker.controller) {
			console.log('Service Worker already registered');
			return;
		}

		const registrations = await navigator.serviceWorker.getRegistrations();
		if (registrations.length > 0) return;

		const worker = navigator.serviceWorker
			.register('/sw.js?v=0.1.2')
			.then((registration) => {
				console.log('Service Worker registered:', registration);
			})
			.catch((error) => {
				console.error('Service Worker registration failed:', error);
			});

		navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
			const data = event.data as Notification;
			if (data && data.type === 'PUSH_NOTIFICATION') {
				console.log('📢 Notificación recibida:', data);
				notifications.push({
					type: data.type,
					title: data.title,
					body: data.body,
					url: data.url
				});
			}
		});
	});
</script>

<ul class="notifications-list">
	{#each notifications as notif}
		<li class="notification-item">
			<a href={notif.url} class="notification">
				<strong>{notif.title}</strong>
				<p>{notif.body}</p>
			</a>
		</li>
	{/each}
</ul>

<style>
	.notifications-list {
		list-style: none;
		padding: 0;
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 1000;
	}
	.notification {
		background: #f8d7da;
		padding: 10px;
		margin: 5px;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
