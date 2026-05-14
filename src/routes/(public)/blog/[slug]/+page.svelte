<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import Icon from '$lib/components/icons/icon.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let showShareButton = $state(false);

	function buttonShare(event: Event) {
		event.preventDefault();
		if (!navigator.share)
			return console.error('Tu navegador no soporta la funcionalidad de compartir');

		if (data.post) {
			navigator.share({
				title: data.post.title,
				text: data.post.exceptr as string,
				url: window.location.href
			});
		}
	}

	const checkButtonVisibility = (event: Event) => {
		showShareButton = window.scrollY > 120;
	};

	onMount(() => {
		window.addEventListener('scroll', checkButtonVisibility);
		return () => window.removeEventListener('scroll', checkButtonVisibility);
	});
</script>

<PageWrapper page="blog-post-page">
	<div class="blog-container" class:error={!data.post}>
		{#if data.post}
			<article class="blog-post-single-container">
				<img
					class="blog-post-image post-image"
					src={data.post.image}
					alt={data.post.title}
					use:errorimage
				/>
				<div class="blog-post-content">
					<h1>{data.post.title}</h1>
					<div class="w1 blog-post post-content single-post">
						<p>{@html data.post.content}</p>
					</div>
				</div>
			</article>

			{#if showShareButton}
				<button class="btn-share" type="button" onclick={buttonShare} transition:fade>
					<Icon icon="share" />
				</button>
			{/if}
		{:else}
			<div class="blog-post-error-container flex column center acenter">
				<h1 class="tcenter">Post no encontrado</h1>
				<p>El post que buscas no existe o ha sido eliminado.</p>
				<p>Por favor, regresa al <a href="/blog">blog</a> para ver otros posts.</p>
			</div>
		{/if}
	</div>

	<div class="w1 related-posts-container">
		{#each data.related_posts as related}
			<article class="w1 blog-article">
				<a href="/blog/{related.slug}" class="w1 block blog-post">
					<div class="w1 article-content">{related.title}</div>
				</a>
			</article>
		{/each}
	</div>
</PageWrapper>

<style>
	.related-posts-container {
		margin: 0 auto;
		max-width: 800px;

		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}
	.related-posts-container .blog-post {
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid #ccc;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.btn-share {
		position: fixed;
		bottom: 10px;
		right: 10px;
		background-color: var(--all);
		color: #fff;
		border: none;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.blog-container {
		max-width: 800px;
		margin: 0 auto;
		border: 1px solid #ccc;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		overflow: hidden;
	}
	.blog-container.error {
		width: 100%;
		max-width: 100%;
		border: none;
		box-shadow: none;
	}
	.blog-container .blog-post-error-container {
		min-height: 90vh;
	}
	.blog-container .blog-post-error-container h1 {
		font-size: 18px;
		font-weight: 700;
		font-family: 'dreadnotus', sans-serif;
		text-transform: uppercase;
	}

	.blog-container .blog-post-content {
		padding: 1rem;
	}

	.blog-container article h1 {
		font-size: 28px;
		font-weight: 700;
		font-family: 'sourcesans', sans-serif;
		text-transform: uppercase;
		margin-bottom: 2rem;
	}
	.blog-container .blog-post-image.post-image {
		width: 100%;
		height: auto;
		max-height: 400px;
		object-fit: cover;
	}

	.blog-container.error .blog-post-error-container a {
		color: #5125a1;
		text-decoration: underline;
	}

	.blog-post.post-content.single-post p {
		margin-bottom: 1rem;
		line-height: 1.4;
		white-space: pre-line;
	}

	@media screen and (max-width: 768px) {
		.blog-container.error .blog-post-error-container {
			min-height: 50vh;
		}
	}
</style>
