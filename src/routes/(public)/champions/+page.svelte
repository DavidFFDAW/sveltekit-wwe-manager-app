<script lang="ts">
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Seo from '$lib/components/seo/seo.svelte';
	import ChampionCard from './champion-card.svelte';

	export let data = { reigns: [] };
</script>

<Seo title="Campeones actuales" description="Campeones actuales de la aplicacion" />

<PageWrapper page="current-champions">
	<div class="current-reigns-grid-container grid three-column-grid gap-medium responsive">
		{#each data.reigns as reign}
			<ChampionCard reign={reign as any} />
		{/each}
	</div>
</PageWrapper>
