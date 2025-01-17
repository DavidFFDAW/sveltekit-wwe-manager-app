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

<AsyncForm>
	<input type="text" name="search" placeholder="Search" />
	<div class="checks">
		<label>
			<input type="checkbox" name="statuses" value="active" />
			Active
		</label>
		<label>
			<input type="checkbox" name="statuses" value="inactive" />
			Inactive
		</label>

		<label>
			<input type="checkbox" name="statuses" value="featured" />
			Featured
		</label>
	</div>
	<button type="submit">Search</button>
</AsyncForm>

<style>
	.single-ppv img {
		width: 100%;
		max-height: 120px;
	}
</style>
