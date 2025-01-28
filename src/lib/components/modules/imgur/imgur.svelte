<script lang="ts">
	import Dialog from '$lib/components/dialog/dialog.svelte';

	let opened: boolean = false;
	export let value: string = '';

	async function fetchImages() {
		const wa = await fetch('/api/imgur/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log({
			response: wa,
			details: await wa.json()
		});

		opened = true;
	}
</script>

<div>
	<button type="button" class="btn imgur" on:click={fetchImages}>Imgur</button>

	<Dialog bind:opened>
		<div class="gallery overflow-vertical h1">
			<h2>No tiene contenido</h2>
			{value}
		</div>
	</Dialog>
</div>
