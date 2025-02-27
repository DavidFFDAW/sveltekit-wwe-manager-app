<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Calendar from './calendar.svelte';

	export let data = { ppvs: [] };
	const format = {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	};
	// console.log(data);
</script>

<AsyncForm redirect="/">
	<div class="w1">
		<Calendar ppvs={data.ppvs} />
	</div>
</AsyncForm>

<!-- <div class="ppvs-list resource-list grid">
	{#each data.ppvs as ppv}
		<div class="single-ppv">
			<img src={ppv.image} alt={ppv.name} />
			<h3>{ppv.name}</h3>
			{#if ppv.game_date}
				<p>{ppv.game_date.toLocaleDateString('es-ES', format as any)}</p>
			{/if}
		</div>
	{/each}
</div> -->

<style>
	.single-ppv img {
		width: 100%;
		max-height: 120px;
	}
</style>
