<script lang="ts">
	import Debug from '$lib/components/visual/debug.svelte';
	import { onMount } from 'svelte';
	let { data } = $props();

	onMount(() => {
		const date = new Date('2024-06-01T12:00:00');
		const iso = date.ww_getIso();
		const ellapsed = date.ww_getEllapsedTime();

		console.log({
			date,
			iso,
			ellapsed
		});
	});
</script>

<Debug datas={data.test} />
