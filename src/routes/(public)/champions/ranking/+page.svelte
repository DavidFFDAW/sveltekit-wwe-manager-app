<script lang="ts">
	import MainHeader from '$lib/components/headers/main-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	let { data } = $props();
</script>

<PageWrapper page="pages-container">
	<MainHeader
		title="Ranking"
		background="https://www.wwe.com/f/styles/gallery_img_l/public/all/2023/05/010_SUR_11222020EJ_45261--c27202041f27ee5ca59d53374ce3d891.jpg"
		mobileBackground="https://www.wwe.com/f/styles/gallery_img_l/public/all/2023/05/010_SUR_11222020EJ_45261--c27202041f27ee5ca59d53374ce3d891.jpg"
		titlePosition="center"
		bgPosition="center"
	/>

	<ul class="ww-wrestlers-container">
		{#each data.ranking as wrestler}
			<li class="ww-wrestler-item">
				<div class="ww-wrestler-image-container">
					<img class="ww-wrestler-image" src={wrestler.wrestler_image} alt={wrestler.name} />
				</div>
				<div class="ww-wrestler-info">
					<h2 class="ww-wrestler-name">{wrestler.name}</h2>
					<p class="ww-wrestler-stats">
						Total Reigns: {wrestler.total_reigns} | Total Days: {wrestler.total_days}
					</p>
					<p class="ww-wrestler-calculated-time">
						Calculated Time: {wrestler.calculated_time}
					</p>
				</div>
			</li>
		{/each}
	</ul>
</PageWrapper>

<style>
	ul.ww-wrestlers-container {
		padding: 0;
		list-style: none;
		max-width: 1200px;
		margin: 0 auto;

		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}
	ul.ww-wrestlers-container li.ww-wrestler-item {
		padding: 1rem;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border: 1px solid #ddd;
		text-align: center;
		overflow: hidden;
	}

	@media (max-width: 600px) {
		ul.ww-wrestlers-container {
			grid-template-columns: 1fr;
		}
		ul.ww-wrestlers-container li.ww-wrestler-item {
			padding: 0.5rem;
		}
	}
</style>
