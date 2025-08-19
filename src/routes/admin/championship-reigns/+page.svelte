<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import HttpButton from '$lib/components/buttons/http-button.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import ChampionshipReignCard from './championship-reign-card.svelte';
	import ChampionshipsSlider from './championships-slider.svelte';

	export let data;
</script>

<PageWrapper page="championship-reigns">
	<header class="championship-reign-page-header">
		<h1 class="w1">Reinados de Campeonatos</h1>
		<HttpButton href="/api/reigns/update-days/current" icon="refresh">Actualizar días</HttpButton>
	</header>
	{#if data.reigns.length === 0}
		<div class="w1 flex center">
			<p>No hay reinados de campeonatos registrados.</p>
		</div>
	{:else}
		<header class="championship-summary-previewss">
			<ChampionshipsSlider championships={data.championships} />
		</header>

		<div class="grouped-championship-reigns">
			{#each data.reigns as [championshipId, reigns]}
				<h2 id={`championship-${championshipId}`} data-championship-id={championshipId} class="w1">
					{reigns[0].Championship.name}
				</h2>

				<ul class="w1 championship-reigns-list">
					{#each reigns as reign}
						{@const isTag = reign.Partner && reign.Championship.tag}
						<li class="w1 championship-reign-item">
							<ChampionshipReignCard isTag={isTag as boolean} reign={reign as any} />
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	{/if}

	<ButtonCreate endpoint="/championship-reigns/create" />
</PageWrapper>

<style>
	:root {
		--background-color: #f9f9f9;
		--box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.grouped-championship-reigns {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.championship-reigns-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.championship-reign-item {
		background-color: var(--background-color);
		border-radius: 0.5rem;
		padding: 1rem;
		box-shadow: var(--box-shadow);
	}
</style>
