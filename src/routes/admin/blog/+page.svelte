<script lang="ts">
	import AsyncButton from '$lib/components/buttons/async-button.svelte';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import SimplePagination from '$lib/components/visual/simple-pagination.svelte';
	import type { PaginationDatas } from '$lib/types/app.types';
	import type { BlogPost } from '@prisma/client';
	import BlogCard from './blog-card.svelte';

	export let data: {
		blogPagination: PaginationDatas<BlogPost>;
		filters: Record<string, any>;
	};
</script>

<PageWrapper page="admin-blog-page">
	<h1>Blog</h1>
	<!-- <a href="/admin/blog/cover-image" class="btn secondary">Administrar imagenes de portada</a> -->
	<header class="blog-page-header">
		<div class="w1 flex end mt-down-small">
			<AsyncButton
				url="/api/blog/slug/refresh"
				method="post"
				text="Regenerar slug de los posts"
				icon="arrow-clockwise"
				classes="btn cta"
			/>
		</div>

		<div class="app-header box">
			<form method="get" class="w1 flex astart column gap-small">
				<Input
					type="text"
					name="search"
					label="Buscar posts"
					placeholder="Buscar por título o slug"
					value={data.filters.searchTitle}
				/>

				<RadioList
					name="published"
					label="Filtrar por estado"
					value={data.filters.publishedFilter}
					options={[
						{ label: 'Publicados', value: 'published' },
						{ label: 'No publicados', value: 'unpublished' }
					]}
				/>

				<div class="w1 flex end acenter">
					<button type="submit" class="btn cta">Buscar</button>
				</div>
			</form>
		</div>
	</header>

	<div class="blog-page-admin-list flex column astart gap-smaller">
		<SimplePagination pages={data.blogPagination.pages} current={data.blogPagination.currentPage} />

		{#each data.blogPagination.list as post}
			<BlogCard {post} />
		{/each}
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
		display: flex;
		gap: 10px;
	}
	.blog-post-card .image-container {
		width: 200px;
		flex-shrink: 0;
		overflow: hidden;
		border-radius: 5px;
	}
	.blog-post-card .blog-card-inner {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.5rem;
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
		max-width: 100%;
		object-fit: cover;
	}

	@media only screen and (max-width: 768px) {
		.blog-post-card .image-container {
			width: 100%;
			height: 160px;
		}
		.blog-post-card .image-container img {
			image-rendering: crisp-edges;
		}
	}
</style>
