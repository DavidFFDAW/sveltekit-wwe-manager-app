<script lang="ts">
	import AsyncButton from '$lib/components/buttons/async-button.svelte';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import SimplePagination from '$lib/components/visual/simple-pagination.svelte';
	import BlogCard from './blog-card.svelte';

	export let data;
</script>

<PageWrapper page="admin-blog-page">
	<header class="page-header">
		<h1>Blog</h1>
		<a href="/admin/blog/ia-log" class="btn secondary inline-block down">
			<i class="bi bi-robot"></i>
			<span>Uso de IA</span>
		</a>
		<a href="/admin/blog/upsert" class="btn cta inline-block down">
			<i class="bi bi-plus-lg"></i>
			<span>Upsert de post</span>
		</a>
	</header>

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

				<div class="flex gap-5 wrap">
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
						value="draft"
						class="btn rounded small filter icon icon-gap-5"
						class:active={data.filters.status === 'draft'}
						aria-label="Buscar borradores"
					>
						<i class="bi bi-journal-text"></i>
						<span>Borradores</span>
					</button>

					<button
						type="submit"
						name="status"
						value="private"
						class="btn rounded small filter icon icon-gap-5"
						class:active={data.filters.status === 'private'}
						aria-label="Buscar privados"
					>
						<i class="bi bi-shield-lock"></i>
						<span>Privados</span>
					</button>
				</div>

				<div class="w1 category-block">
					<ul class="categories-list">
						{#each data.categories as category}
							<li>
								<button
									type="submit"
									name="category"
									value={category.value}
									class="btn rounded small icon icon-gap-5"
									class:active={data.filters.category === category.value}
									aria-label={`Buscar categoría ${category.name}`}
								>
									<span>{category.name}</span>
								</button>
							</li>
						{/each}
					</ul>
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

<style>
	.category-block ul.categories-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.category-block ul.categories-list li button.btn {
		display: block;
		min-width: 80px;
		background-color: #fff;
		border: 1px solid #333;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		text-align: center;
	}
	.category-block ul.categories-list li button.btn.active {
		background-color: #333;
		color: #fff;
	}
</style>
