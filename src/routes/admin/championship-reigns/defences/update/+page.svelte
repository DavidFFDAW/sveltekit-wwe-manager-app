<script lang="ts">
	// /admin\championship-reigns\defences\update
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import NumberInputControls from '$lib/components/forms/inputs/number-input-controls.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="reigns-defences-update-page">
	<header class="page-header">
		<h1>Actualizar defensas</h1>
		<small>Actualiza la cantidad de defensas de cada título en los reinados actuales.</small>
	</header>

	<AsyncForm method="post" reset={true} buttonText="Actualizar defensas">
		{#if data.reigns.length > 0}
			<div class="grid wrestlers-reigns-grid">
				{#each data.reigns as reign}
					<input type="hidden" name="reign-id" value={reign.id} />
					<div class="box single-wrestler-reign-card flex column gap-smaller acenter">
						<img src={reign.Wrestler.image_name} alt={reign.Wrestler.name} width="100" />
						<h2 class="w1 tcenter title">{reign.Championship.name}</h2>
						<NumberInputControls
							label="Defensas"
							name="defenses"
							min={0}
							value={reign.defences}
							step={1}
						/>
					</div>
				{/each}
			</div>
		{/if}
	</AsyncForm>
</section>

<style>
	.grid.wrestlers-reigns-grid {
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
	}

	.box.single-wrestler-reign-card h2.title {
		font-size: 0.84rem;
		margin: 0;
	}
</style>
