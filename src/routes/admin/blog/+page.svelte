<script lang="ts">
	import AsyncButton from '$lib/components/buttons/async-button.svelte';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import SimplePagination from '$lib/components/visual/simple-pagination.svelte';
	import BlogCard from './blog-card.svelte';

	export let data;
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
			<form method="get" class="w1 flex astart column gap-small filters-box">
				<Input
					type="text"
					name="search"
					label="Buscar posts"
					placeholder="Buscar por título o slug"
					value={data.filters.searchTitle}
				/>

				<div class="flex gap-5">
					<button
						type="submit"
						name="status"
						value="published"
						class="btn small rounded filter icon icon-gap-5"
						class:active={data.filters.status === 'published'}
						aria-label="Buscar publicados"
					>
						<i class="bi bi-file-post"></i>
						<span>Publicados</span>
					</button>

					<button
						type="submit"
						name="status"
						value="unpublished"
						class="btn rounded small filter icon icon-gap-5"
						class:active={data.filters.status === 'unpublished'}
						aria-label="Buscar no publicados"
					>
						<i class="bi bi-eye-slash-fill"></i>
						<span>No publicados</span>
					</button>

					<button
						type="submit"
						name="status"
						value="draft"
						class="btn rounded small filter icon icon-gap-5"
						class:active={data.filters.status === 'draft'}
						aria-label="Buscar borradores"
					>
						<i class="bi bi-journal-text"></i>
						<span>Borradores</span>
					</button>
				</div>

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
