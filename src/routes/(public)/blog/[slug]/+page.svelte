<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { BlogPost } from '@prisma/client';

	export let data: { post: BlogPost | null } = { post: null };
</script>

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
