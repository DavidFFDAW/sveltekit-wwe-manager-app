<script lang="ts">
	import DatasetInput from '$lib/components/forms/inputs/dataset-input.svelte';
	let victoryWay: string = $state('');
	let { data } = $props();
</script>

<DatasetInput
	name="victory_way"
	label="Forma en que se ganó"
	bind:value={victoryWay}
	options={data.ppvs}
/>
