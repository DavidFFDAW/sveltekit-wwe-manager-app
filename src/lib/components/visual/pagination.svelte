<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	export let itemsPerPage: number = 10;
	export let total: number;
	export let currentPage: number;

	function getUrl(newPage: number) {
		const currentUrl = $page.url;
		currentUrl.searchParams.set('page', newPage.toString());
		return currentUrl.toString();
	}

	let totalPages = Math.ceil(total / itemsPerPage);
</script>

<nav class="pagination">
	{#if currentPage > 1}
		<a href={getUrl(currentPage - 1)} aria-label="Página anterior"> &laquo; </a>
	{/if}

	<!-- Botones de las páginas -->
	{#if totalPages > 1}
		{#each Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5) as page}
			<a href={getUrl(page)} class:active={page === currentPage} aria-label={`Página ${page}`}>
				{page}
			</a>
		{/each}
	{/if}

	<!-- Botón de página siguiente -->
	{#if currentPage < totalPages}
		<a href={getUrl(currentPage + 1)} aria-label="Página siguiente"> &raquo; </a>
	{/if}
</nav>

<style>
	.pagination {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
	}

	a {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: white;
		cursor: pointer;
		font-size: 1rem;
	}

	a.active {
		background-color: #007bff;
		color: white;
		font-weight: bold;
		border-color: #007bff;
	}
</style>
