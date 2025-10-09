<script lang="ts">
	import MainHeader from '$lib/components/headers/main-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import ChampionCard from './champion-card.svelte';

	export let data = { reigns: [] };
</script>

<PageWrapper page="current-champions">
	<MainHeader
		title="Campeones"
		background="https://www.wwe.com/f/styles/gallery_img_l/public/all/2024/01/089_RR_01272027CA_48434--08dea04fc07a4eb88fd70879b50249b6.jpg"
		mobileBackground="https://www.wwe.com/f/styles/gallery_img_l/public/all/2024/01/089_RR_01272027CA_48434--08dea04fc07a4eb88fd70879b50249b6.jpg"
		titlePosition="center"
		bgPosition="center"
	/>
	<div class="current-reigns-grid-container grid three-column-grid gap-medium responsive">
		{#each data.reigns as reign}
			<ChampionCard reign={reign as any} />
		{/each}
	</div>
</PageWrapper>
