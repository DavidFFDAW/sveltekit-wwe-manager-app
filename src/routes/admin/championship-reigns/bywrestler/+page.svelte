<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';
	// import Debug from '$lib/components/visual/debug.svelte';
	let { data } = $props();
</script>

<div class="page">
	<header class="page-header">
		<h1>Reinados de {data.bywrestler.wrestler.name}</h1>
		<small>Desglose de reinados por persona</small>
	</header>

	<div>
		<ul class="grid list-container">
			{#each data.bywrestler.reigns as reign}
				<li class="list-item list-reign-item relative">
					<img
						width="100"
						src={reign.Championship.image}
						alt={reign.Championship.name}
						class="championship-image"
						use:errorimage={'unknown-championship.webp'}
					/>
					<h3 class="tcenter">{reign.Championship.name}</h3>
					<p>Duración: {reign.days_str}</p>
					<p>{reign.won_date_str} - {reign.lost_date_str}</p>
					{#if reign.Partner}
						<p class="badge"><em>Con {reign.Partner.name}</em></p>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.grid.list-container {
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}
	.grid.list-container .list-item.list-reign-item {
		width: 100%;
		min-height: 150px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		gap: 4px;
	}
</style>
