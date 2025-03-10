<script lang="ts">
	import { onMount } from 'svelte';

	interface Notification {
		type: string;
		title: string;
		body: string;
		url: string;
	}

	let notifications: Notification[] = [];

	function handlePushMessage(event: MessageEvent) {
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
	}

	onMount(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.addEventListener('message', handlePushMessage);
		}
	});

	function openNotification(url: string) {
		window.open(url, '_blank');
	}
</script>

<div>
	{#each notifications as notif}
		<a href={notif.url} class="notification">
			<strong>{notif.title}</strong>
			<p>{notif.body}</p>
		</a>
	{/each}
</div>

<style>
	.notification {
		background: #f8d7da;
		padding: 10px;
		margin: 5px;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
