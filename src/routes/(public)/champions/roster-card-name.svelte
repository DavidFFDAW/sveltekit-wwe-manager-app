<script lang="ts">
	export let name: string;
	export let brand: string = '';

	$: splitted = name.split(/\s+/);
	$: firstName = splitted.slice(0, splitted.length - 1).join(' ');
	$: lastName = splitted[splitted.length - 1];
</script>

<h2 class="roster-wrestler-name">
	{#if splitted.length < 2}
		<strong class={`lastname-${brand.toLowerCase()}`}>{name}</strong>
	{:else}
		{firstName} <strong class={`lastname-${brand.toLowerCase()}`}>{lastName}</strong>{' '}
	{/if}
</h2>

<style>
	.container {
		color: red;
	}
</style>
