<script lang="ts">
	import { onMount } from 'svelte';

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

		navigator.serviceWorker
			.register('/sw.js?v=0.1.0')
			.then((reg) => {
				console.log('Service Worker registered', reg);
			})
			.catch((err) => {
				console.log('Service Worker registration failed', err);
			});
	});
</script>
