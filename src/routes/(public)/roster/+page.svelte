<script>
	import Seo from '$lib/components/seo/seo.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import RosterCard from '$lib/components/visual/roster-card.svelte';
	import MainHeader from '$lib/components/headers/main-header.svelte';

	export let data = { wrestlers: [] };
</script>

<Seo title="Roster" description="Roster de la WWE" />

<PageWrapper page="roster-page">
	<MainHeader
		title="Roster"
		background="https://wallpapers.com/images/hd/cody-rhodes-wwe-entrance-28rxfrklndc7ho1n.jpg"
		mobileBackground="https://wallpapers.com/images/hd/cody-rhodes-wwe-entrance-28rxfrklndc7ho1n.jpg"
		titlePosition="center"
		bgPosition="center"
	/>

	<div class="w1 flex column astart">
		<form action="" method="get" class="w1 flex start gap-smaller">
			<input type="text" name="search" placeholder="Search" />

			<button type="submit">Search</button>
		</form>
	</div>

	<div class="grid unconventional-grid">
		{#each data.wrestlers as wrestler}
			<div class="grid-item">
				<RosterCard {wrestler} />
			</div>
		{/each}
	</div>
</PageWrapper>
