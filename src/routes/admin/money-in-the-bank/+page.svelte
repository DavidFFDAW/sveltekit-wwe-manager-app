<script lang="ts">
	import Debug from '$lib/components/visual/debug.svelte';

	let { data } = $props();
	$inspect(data.mitb);
</script>

<Debug datas={data.mitb} />
