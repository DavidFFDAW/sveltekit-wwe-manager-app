<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import ChampionshipActions from './championship-actions.svelte';
	export let data;
</script>

<PageWrapper page="admin-championships-page">
	<h1>Administrar campeonatos</h1>

	<div class="grid grid-championship-column gap-small">
		{#each data.championships as championship}
			<div class="championship-specific-card relative" class:non-visible={!championship.active}>
				<img
					use:errorimage={'/unknown-championship.webp'}
					src={championship.image}
					alt={championship.name}
				/>
				<h3 class="tcenter">{championship.name}</h3>

				{#if championship.ChampionshipReign.length > 0}
					<p class="has-reigns-txt tcenter">Con reinados</p>
				{/if}

				<div class="absolute top right actions">
					<ChampionshipActions {championship} />
				</div>
			</div>
		{/each}
	</div>
</PageWrapper>

<style>
	.grid-championship-column {
		grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
	}
	.championship-specific-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
		border-radius: 5px;
		background-color: #fff;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		gap: 10px;
	}
	.championship-specific-card.non-visible {
		filter: grayscale(100%) opacity(0.5);
	}
	.championship-specific-card.non-visible .actions {
		filter: grayscale(0) opacity(1);
	}
	.championship-specific-card img {
		width: 100%;
		height: auto;
		max-width: 150px;
		max-height: 150px;
		padding: 2px;
		object-fit: contain;
	}

	p.has-reigns-txt {
		position: absolute;
		top: 0;
		left: 0;
		font-size: 12px;
		padding: 5px;
		border-radius: 5px;
	}

	@media (max-width: 768px) {
		.grid-championship-column {
			grid-template-columns: repeat(1, 1fr);
			gap: 25px;
		}
		.championship-specific-card img {
			height: 150px;
		}
	}
</style>
