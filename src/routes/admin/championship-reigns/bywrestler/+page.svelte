<script lang="ts">
	import Debug from '$lib/components/visual/debug.svelte';

	let { data } = $props();
</script>

<div class="page">
	<header class="page-header">
		<h1>Reinados de {data.bywrestler.wrestler.name}</h1>
		<small>Desglose de reinados por persona</small>
	</header>

	<div>
		<Debug datas={data.bywrestler.reigns} />
	</div>
</div>
