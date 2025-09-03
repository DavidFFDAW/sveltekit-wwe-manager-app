<script lang="ts">
	import TweetCard from '$lib/components/twitter/tweet-card.svelte';
	export let data;
</script>

<header class="page-header">
	<h1>Twitter</h1>
	<small class="block">Últimas noticias y actualizaciones de Twitter</small>
</header>

<section class="tweets-list-container down">
	{#if data.tweets.length === 0}
		<h2>No hay tweets</h2>
	{:else}
		<ul class="w1 tweets-list flex column gap-medium">
			{#each data.tweets as tweet}
				<li class="w1 tweet-card-item">
					<TweetCard {tweet} />
				</li>
			{/each}
		</ul>
	{/if}
</section>
