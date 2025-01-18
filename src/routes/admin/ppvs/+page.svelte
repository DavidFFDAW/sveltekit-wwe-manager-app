<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';

	export let data = { ppvs: [] };
	const format = {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	};
	// console.log(data);
</script>

<AsyncForm redirect="/">
	<input type="text" name="search" placeholder="Search" value="wadsda" />
	<div class="checks">
		<label>
			<input type="checkbox" name="status" value="active" checked />
			Active
		</label>
		<label>
			<input type="checkbox" name="status" value="inactive" checked />
			Inactive
		</label>

		<label>
			<input type="checkbox" name="status" value="featured" checked />
			Featured
		</label>
	</div>
	<button type="submit">Search</button>
</AsyncForm>

<div class="ppvs-list resource-list grid">
	{#each data.ppvs as ppv}
		<div class="single-ppv">
			<img src={ppv.image} alt={ppv.name} />
			<h3>{ppv.name}</h3>
			{#if ppv.game_date}
				<p>{ppv.game_date.toLocaleDateString('es-ES', format as any)}</p>
			{/if}
		</div>
	{/each}
</div>

<style>
	.single-ppv img {
		width: 100%;
		max-height: 120px;
	}
</style>
