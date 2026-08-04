<script lang="ts">
	import MainHeader from '$lib/components/headers/main-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	let { data } = $props();
</script>

<PageWrapper page="pages-container">
	<MainHeader
		title="Ranking por campeonatos"
		background="https://i.pinimg.com/736x/6d/9d/de/6d9ddeed7c0344b6b345658dbaf32b26.jpg"
		mobileBackground="https://i.pinimg.com/736x/6d/9d/de/6d9ddeed7c0344b6b345658dbaf32b26.jpg"
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
						Veces ganado: {wrestler.times_won} | Total Days: {wrestler.total_days}
					</p>
					<p class="ww-wrestler-stats">
						Campeonato: {wrestler.championship_name}
					</p>
					<div class="ww-wrestler-image-container">
						<img
							width="100"
							height="100"
							class="ww-wrestler-image"
							src={wrestler.championship_image}
							alt={wrestler.championship_name}
						/>
					</div>
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
		text-align: center;
		overflow: hidden;
	}
</style>
