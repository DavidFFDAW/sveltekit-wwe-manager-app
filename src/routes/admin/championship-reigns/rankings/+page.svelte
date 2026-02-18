<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import Debug from '$lib/components/visual/debug.svelte';
	let { data } = $props();
</script>

<!-- <Debug datas={data.rankings} /> -->
<div class="page">
	<header class="page-header">
		<h1>Ranking</h1>
		<small>Ranking de personas con más reinados</small>
	</header>

	<div class="ranking-list-container">
		<ul class="grid list-container">
			{#each data.rankings as reign}
				<li class="item card wrestler-card" class:tag={reign.tag}>
					<div class="card-header">
						<img
							width="80"
							src={reign.wrestler.image_name}
							alt={reign.wrestler.name}
							use:errorimage={'vacant.webp'}
						/>
						{#if reign.partner}
							<img
								width="80"
								src={reign.partner.image_name}
								alt={reign.partner.name}
								use:errorimage={'vacant.webp'}
							/>
						{/if}
						<h3>
							{reign.wrestler.name}
							{#if reign.partner}
								& {reign.partner.name}
							{/if}
						</h3>
					</div>
					<div class="card-body">
						<p><strong>Reinados:</strong> {reign.times_champion}</p>
						<p><strong>Días como campeón:</strong> {reign.days_str}</p>
					</div>

					<a
						href="/admin/championship-reigns/bywrestler?id={reign.wrestler.id}"
						class="btn small info card-footer inline-block"
					>
						<i class="fa-solid fa-eye"></i>
						Ver desglose de reinados
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.ranking-list-container {
		padding: 5px 15px;
	}

	.grid.list-container {
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 8px;
	}

	.item {
		padding: 1rem;
		border: 1px solid #ccc;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}
</style>
