<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncButton from '$lib/components/buttons/async-button.svelte';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { BlogPost } from '@prisma/client';
	export let data: { posts: BlogPost[] } = { posts: [] };
</script>

<PageWrapper page="admin-blog-page">
	<h1>Administrar Blog</h1>

	<AsyncButton
		url="/api/blog/slug/refresh"
		method="post"
		text="Regenerar slug de los posts"
		classes="w1 cta"
		icon="arrow-clockwise"
	/>

	<div class="w1 grid three-column-grid gap-small responsive">
		{#each data.posts as post}
			<div class="blog-post-card flex column gap-5" data-id={post.id}>
				<div class="image-container">
					<img src={post.image} alt={post.title} use:errorimage />
				</div>
				<small>{post.slug}</small>
				<h2>{post.title}</h2>
				<p class="down">{post.exceptr}</p>
			</div>
		{/each}
	</div>

	<!-- <ButtonCreate endpoint="/blog/create" /> -->
</PageWrapper>

<style>
	.blog-post-card {
		padding: 1rem;
		border: 1px solid #ccc;
		background-color: #ffffff;
		border-radius: 5px;
		margin-bottom: 1rem;
	}

	.blog-post-card .image-container {
		height: 200px;
		overflow: hidden;
	}

	.blog-post-card .image-container img {
		width: 100%;
		height: 100%;
		object-fit: fill;
	}
</style>
