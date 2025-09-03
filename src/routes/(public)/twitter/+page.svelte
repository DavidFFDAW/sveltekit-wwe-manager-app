<script lang="ts">
	import Debug from '$lib/components/visual/debug.svelte';

	export let data;
</script>

<h1>Twitter</h1>
<section class="tweets-list-container">
	{#if data.tweets.length === 0}
		<p>No hay tweets</p>
	{:else}
		<ul class="w1 tweets-list flex column gap-medium">
			{#each data.tweets as tweet}
				<li class="w1 tweet-card box">
					<header class="tweet-header">
						<h2 class="tweet-author">{tweet.author_id}</h2>
						<p class="tweet-date">{tweet.created_at?.toLocaleString()}</p>
					</header>

					<p class="tweet-message">{tweet.message}</p>

					<footer class="tweet-footer flex between gap-smaller">
						<button type="button" class="reply-button unbutton">
							<i class="bi bi-reply"></i>
							<span>{tweet.comments}</span>
						</button>
						<button type="button" class="retweet-button unbutton">
							<i class="bi bi-arrow-repeat"></i>
							<span>{tweet.retweets}</span>
						</button>
						<button type="button" class="like-button unbutton">
							<i class="bi bi-heart"></i>
							<span>{tweet.likes}</span>
						</button>
					</footer>
				</li>
			{/each}
		</ul>
	{/if}
</section>
