<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!('serviceWorker' in navigator)) {
			console.warn('Service Worker not supported');
			return;
		}

		navigator.serviceWorker
			.register('/sw.js')
			.then((reg) => {
				console.log('Service Worker registered', reg);
			})
			.catch((err) => {
				console.log('Service Worker registration failed', err);
			});
	});
</script>
