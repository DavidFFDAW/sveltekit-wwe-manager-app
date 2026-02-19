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
					<p>{reign.days_str}</p>
					<p class="badge absolute top right">{reign.won_date_str} - {reign.lost_date_str}</p>
					{#if reign.Partner}
						<em>Con {reign.Partner.name}</em>
					{/if}

					{#if reign.current && !reign.lost_date}
						<div class="reign-current-indicator">
							<i class="bi bi-lightning-charge-fill current-reign-icon"></i>
						</div>
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
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: calc(150px + 45px);
		padding: 45px 1rem 1rem 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		gap: 4px;
	}

	.reign-current-indicator {
		--current-indicator-color: #f1c04d;
		position: absolute;
		left: 0;
		top: -10px;
		color: var(--current-indicator-color);
		background-color: transparent;
		font-size: 1.5rem;
		/* padding: 0.25rem 0.5rem; */
		/* border-radius: 8px; */
	}
</style>
