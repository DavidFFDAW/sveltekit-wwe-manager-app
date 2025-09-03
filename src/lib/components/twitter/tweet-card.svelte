<script lang="ts">
	import type { Tweets } from '@prisma/client';
	import Image from '../visual/image.svelte';

	export let tweet: Tweets;
	export let endpoint: string = '/tweet/{{slug}}';
</script>

<a class="w1 tweet-card" href={endpoint.replace('{{slug}}', tweet.id.toString())}>
	<header class="w1 tweet-header tweet-profile flex start astart gap-5">
		<div class="tweet-image">
			<Image
				src={tweet.profile_image}
				alt="avatar"
				width="50"
				height="50"
				fallback="/noimage.jpg"
			/>
		</div>
		<div class="profile flex column astart">
			<strong>{tweet.profile_name}</strong>
			<small>@{tweet.profile_handle?.replace(/@/gi, '').replace(/ /gi, '')}</small>
		</div>
	</header>

	<article class="w1 tweet-body">
		<p class="content">
			{@html tweet.message.replace(/#(\w+)/g, '<a href="/hashtag/$1" class="hashtag">#$1</a>')}
		</p>
		{#if tweet.created_at}
			<p class="date">
				<small>{tweet.created_at.toLocaleString()}</small>
			</p>
		{/if}
	</article>

	<footer class="w1 tweet-footer social-interactions flex between gap-smaller">
		<button type="button" class="btn unbutton small" aria-label="Reply">
			<i class="bi bi-reply"></i>
			<span class="interaction-text">{tweet.comments}</span>
		</button>

		<button type="button" class="btn unbutton small" aria-label="Retweet">
			<i class="bi bi-arrow-repeat"></i>
			<span class="interaction-text">{tweet.retweets}</span>
		</button>

		<button type="button" class="btn unbutton small" aria-label="Like">
			<i class="bi bi-heart"></i>
			<span class="interaction-text">{tweet.likes}</span>
		</button>

		<button type="button" class="btn unbutton small" aria-label="Views">
			<i class="bi bi-eye"></i>
			<span class="interaction-text">{tweet.comments + tweet.retweets + tweet.likes}</span>
		</button>
	</footer>
</a>

<style>
	a.tweet-card {
		display: block;
		text-decoration: none;
		color: inherit;
	}
	.tweet-card {
		padding: 1rem;
		background: white;
		border: 1px solid #eee;
		border-radius: 8px;
		overflow: hidden;
	}
	.tweet-image {
		overflow: hidden;
		border-radius: 50%;
	}
	.tweet-body {
		margin: 0.5rem 0;
		padding: 0.5rem 0;
		color: #14171a;
	}
	.tweet-body p {
		width: 100%;
		white-space: pre-wrap;
	}
	:global(.tweet-body .hashtag) {
		color: #1da1f2;
		text-decoration: underline;
	}
	.tweet-body .date {
		color: #657786;
		font-size: 0.875rem;
		margin-top: 0.5rem;
	}
	.tweet-footer {
		border-top: 1px solid #eee;
		padding-top: 0.5rem;
	}
</style>
