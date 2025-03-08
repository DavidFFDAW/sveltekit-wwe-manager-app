<script lang="ts">
	import { page } from '$app/stores';
	import { errorimage } from '$lib/actions/error.image';
	import Icon from '$lib/components/icons/icon.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Seo from '$lib/components/seo/seo.svelte';
	import type { BlogPost } from '@prisma/client';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let showShareButton = false;
	export let data: { post: BlogPost } = { post: {} as BlogPost };

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

<Seo
	title={data.post.title}
	description={data.post.exceptr?.slice(0, 155)}
	image={data.post.image}
	robots="index, follow"
>
	<meta property="og:type" content="article" />
	<meta property="og:updated_time" content={data.post.updated_at?.getTime().toString()} />
	<meta property="article:published_time" content={data.post.created_at?.getTime().toString()} />
	<meta property="article:author" content="WWE Manager" />
	<meta property="article:section" content="Blog" />
	<meta property="article:tag" content="WWE" />
</Seo>

<PageWrapper page="blog-post-page">
	<div class="blog-container" class:error={!data.post}>
		{#if data.post}
			<article class="blog-post-single-container">
				<img src={data.post.image} alt={data.post.title} use:errorimage />
				<div class="blog-post-content">
					<h1>{data.post.title}</h1>
					<p>{@html data.post.content}</p>
				</div>
			</article>

			{#if showShareButton}
				<button class="btn-share" type="button" on:click={buttonShare} transition:fade>
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
</PageWrapper>

<style>
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
		border-radius: 5px;
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
		font-size: 22px;
		font-weight: 700;
		font-family: 'sourcesans', sans-serif;
		text-transform: uppercase;
	}

	.blog-container.error .blog-post-error-container a {
		color: #5125a1;
		text-decoration: underline;
	}

	@media screen and (max-width: 768px) {
		.blog-container.error .blog-post-error-container {
			min-height: 50vh;
		}
	}
</style>
