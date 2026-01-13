<script lang="ts">
	let { data } = $props();
	let pages = $derived(Array.from({ length: data.maxPages }).map((_, i) => i + 1));
</script>

<section class="gallery-page">
	<header class="page-header">
		<h1>Imagenes</h1>
		<small>Imágenes de {data.provider}</small>
	</header>

	<div class="gallery-container">
		<ul class="gallery-list">
			{#each data.gallery as image}
				<li class="gallery-item">
					<img
						width="50"
						src={image.url}
						alt="{image.name} galería"
						loading="lazy"
						draggable="false"
					/>
					<span>{image.name}</span>
				</li>
			{/each}
		</ul>

		<div class="pagination-container">
			<nav class="pagination">
				{#each pages as page}
					{#if page === data.page}
						<span
							class="pagination-link active"
							aria-label={`Página ${page}`}
							title="Página actual {page}"
						>
							{page}
						</span>
					{:else}
						<a
							href={`?page=${page}`}
							class="pagination-link"
							aria-label={`Enlace a la página ${page} de galería`}
							title="Ir a la página {page}"
						>
							{page}
						</a>
					{/if}
				{/each}
			</nav>
		</div>
	</div>
</section>

<style>
	.gallery-page {
		max-width: 900px;
		margin: 0 auto;
		padding: 1rem;
	}
	.gallery-page ul.gallery-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 10px;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.gallery-page ul.gallery-list li {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 3px;
		overflow: hidden;
	}

	.gallery-page ul.gallery-list li img {
		width: 100%;
		height: auto;
		border: 1px solid #ccc;
		border-radius: 4px 4px 0 0;
		object-fit: cover;
	}

	.gallery-page ul.gallery-list li span {
		max-width: 100%;
		font-size: 0.875rem;
		color: #666;
		text-align: center;
		margin-top: 2px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pagination-container {
		max-width: 600px;
		margin: 0 auto;
		overflow-x: auto;
		white-space: nowrap;
	}
	.pagination {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
		margin-top: 1rem;
	}

	.pagination-link {
		display: inline-block;
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: white;
		cursor: pointer;
		font-size: 1rem;
		text-decoration: none;
		color: inherit;
	}

	.pagination-link.active {
		background-color: #007bff;
		color: white;
		font-weight: bold;
		border-color: #007bff;
	}
</style>
