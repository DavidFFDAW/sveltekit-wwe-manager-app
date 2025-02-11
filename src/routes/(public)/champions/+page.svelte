<script lang="ts">
	// import AsyncButton from '$lib/components/buttons/async-button.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import ChampionCard from './champion-card.svelte';

	export let data = { reigns: [] };
</script>

<PageWrapper page="current-champions">
	<!-- <AsyncButton url="/api/brands/adjust" text="Ajustar marcas" classes="btn cta" icon="settings" /> -->

	<div class="current-reigns-grid-container grid three-column-grid gap-medium responsive">
		{#each data.reigns as reign}
			<ChampionCard reign={reign as any} />
		{/each}
	</div>
</PageWrapper>
