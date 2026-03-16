<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import ChampionshipReignCard from '../championship-reign-card.svelte';

	let { data } = $props();
</script>

<PageWrapper page="championship-reigns">
	<header class="championship-reign-page-header">
		<h1 class="w1">Reinados de Campeonatos</h1>
		<a class="btn info inline-block" href="{data.path}/rankings">
			<i class="bi bi-trophy"></i>
			<span class="tooltip">Rankings</span>
		</a>
		<a href="{data.path}/upsert" class="btn success inline-block">
			<i class="bi bi-plus"></i>
			<span class="tooltip">Nuevo reinado</span>
		</a>
		<!-- <HttpButton href="/api/reigns/update-days/current" icon="refresh">Actualizar días</HttpButton> -->
	</header>

	<form action="" method="get" class="w1 box">
		<input type="hidden" name="id" value={data.reigns_panel.championshipId} />
		<div class="w1 flex start acenter gap-small buttons year-buttons-container">
			{#each data.reigns_panel.years as yr}
				<button
					type="submit"
					name="year"
					value={yr}
					class="btn filter"
					class:active={yr === data.reigns_panel.currentYear}
					disabled={yr === data.reigns_panel.currentYear}
				>
					{yr}
				</button>
			{/each}
		</div>
	</form>

	<!-- <Debug datas={data.reigns_panel} /> -->

	{#if data.reigns_panel.reigns.length > 0}
		<div class="grouped-championship-reigns">
			<ul class="w1 championship-reigns-list">
				{#each data.reigns_panel.reigns as reign}
					{@const isTag = reign.Partner && reign.Championship.tag}
					<li
						class="w1 championship-reign-item"
						data-championship-id={reign.championship_id}
						data-reign-id={reign.id}
					>
						<ChampionshipReignCard isTag={isTag as boolean} reign={reign as any} />
					</li>
				{/each}
			</ul>
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

	.grid.championships-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		place-items: stretch;
		gap: 12px;
	}

	.grid.championships-list a {
		width: 100%;
		height: 100%;
		min-height: 135px;
		max-height: 135px;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		align-items: center;
		gap: 15px;
		padding: 20px 15px;
		border-radius: 8px;
		background-color: #fff;
		border: 1px solid #ccc;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		text-align: center;
	}

	.grid.championships-list a:hover {
		background-color: #e8f5fe;
		border-color: #00aaff;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.grid.championships-list a img {
		width: 80px;
		height: 60px;
		max-width: 80px;
		max-height: 80px;
		object-fit: contain;
	}
	.grid.championships-list a.inactive img {
		opacity: 0.5;
		filter: grayscale(60%);
	}
	.grid.championships-list a h2 {
		font-size: 1rem;
		color: #333;
		text-transform: uppercase;
		font-family: 'rumble';
		letter-spacing: -1px;
	}

	.grid.championships-list a .badge {
		position: absolute;
		top: 10px;
		right: 10px;
	}

	.grid.championships-list a .badge.badge-active {
		display: inline-block;
		font-size: 0.75rem;
		padding: 2px 10px;
		border-radius: 50px;
		background-color: #333;
		color: #fff;
	}
</style>
