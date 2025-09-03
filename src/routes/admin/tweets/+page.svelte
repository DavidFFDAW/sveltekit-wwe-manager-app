<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import Image from '$lib/components/visual/image.svelte';
	export let data;
</script>

<header class="page-header">
	<h1>Tweets</h1>
	<small>Gestiona los tweets que se mostrarán en la aplicación.</small>
</header>

<a href="upsert" class="btn small info">
	<i class="bi bi-plus"></i>
	<span class="sp">Nuevo Tweet</span>
</a>

<section class="tweets-container down">
	<ul class="flex column gap">
		{#each data.tweets as tweet}
			<li class="w1 tweet-card">
				<header class="tweet-header flex start gap-5">
					<Image
						src={tweet.profile_image}
						alt="avatar"
						width="48"
						height="48"
						fallback="/noimage.jpg"
					/>
					<div class="tweet-user">
						<strong>{tweet.profile_name}</strong>
						<small>@{tweet.profile_handle?.replace(/ /g, '')}</small>
					</div>
				</header>

				<article class="tweet-content">
					<p class="tweet-content">{tweet.message}</p>
					<small class="date">{tweet.created_at}</small>
				</article>

				<footer class="tweet-footer social-interactions flex between">
					<a href="tweets/upsert/{tweet.id}" class="btn small warn" aria-label="Editar">
						<i class="bi bi-pencil"></i>
						<span class="interaction-text">Editar</span>
					</a>
				</footer>
			</li>
		{/each}
	</ul>
</section>

<ButtonCreate endpoint="tweets/upsert" />

<style>
	.tweets-container {
		max-width: 600px;
		margin: 0 auto;
	}
	.tweets-container li.tweet-card {
		background: #ffffff;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
