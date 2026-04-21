<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import ButtonsPagination from '$lib/components/visual/pagination/buttons-pagination.svelte';
	let { data } = $props();
</script>

<!-- <Debug datas={data.rankings} /> -->
<div class="page">
	<header class="page-header">
		<h1>Ranking</h1>
		<small>Ranking de personas con más reinados</small>
	</header>

	<div class="ranking-list-container">
		<ul class="grid list-container responsive">
			{#each data.ranking.list as reign}
				<li
					class="item card wrestler-card wrestler-{reign.id}"
					class:tag={reign.has_partner_reigns}
					data-reign-wrestler={reign.wrestler.name}
				>
					<div class="card-header">
						<img
							width="80"
							src={reign.wrestler.image}
							alt={reign.wrestler.name}
							use:errorimage={'/vacant.webp'}
						/>
						<h3>
							{reign.wrestler.name}
							{#if reign.has_partner_reigns}
								con reinados de tag team
							{/if}
						</h3>
					</div>
					<div class="card-body">
						<p><strong>Reinados:</strong> {reign.reigns}</p>
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

		<ButtonsPagination page={data.ranking.page} />
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
