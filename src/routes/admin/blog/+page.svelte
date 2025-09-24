<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncButton from '$lib/components/buttons/async-button.svelte';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { BlogPost } from '@prisma/client';
	import BlogActions from './blog-actions.svelte';

	export let data: { posts: BlogPost[] } = { posts: [] };
</script>

<PageWrapper page="admin-blog-page">
	<h1>Administrar Blog</h1>
	<a href="/admin/blog/cover-image" class="btn secondary">Administrar imagenes de portada</a>

	<div class="blog-page-admin-list flex column astart gap-smaller">
		<div class="w1 flex end">
			<AsyncButton
				url="/api/blog/slug/refresh"
				method="post"
				text="Regenerar slug de los posts"
				icon="arrow-clockwise"
				classes="btn cta"
			/>
		</div>

		<div class="w1 grid two-column-grid gap-small responsive">
			{#each data.posts as post}
				<div
					class="blog-post-card relative flex column gap-5"
					class:visible={post.visible}
					data-id={post.id}
				>
					<div class="image-container">
						<img src={post.image} alt={post.title} use:errorimage />
					</div>
					<small>{post.slug}</small>
					<h2>{post.title}</h2>
					<small>{post.views} visitas</small>
					<p class="down">{post.exceptr}</p>

					<div class="w1 flex end absolute top righ">
						<BlogActions {post} />
					</div>
				</div>
			{/each}
		</div>
	</div>

	<ButtonCreate endpoint="/blog/create" />
</PageWrapper>

<style>
	.blog-post-card {
		padding: 1rem;
		border: 1px solid #ccc;
		background-color: #ffffff;
		border-radius: 5px;
		margin-bottom: 1rem;
	}

	.blog-post-card {
		filter: grayscale(100%) opacity(0.5);
	}
	.blog-post-card.visible {
		filter: none;
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
