<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	export let itemsPerPage: number = 10;
	export let total: number;
	export let currentPage: number;

	function getUrl(newPage: number) {
		const currentUrl = page.url;
		currentUrl.searchParams.set('page', newPage.toString());
		return currentUrl.toString();
	}

	$: totalPages = Math.ceil(total / itemsPerPage);
</script>

<nav class="pagination">
	{#if currentPage > 1}
		<a href={getUrl(currentPage - 1)} aria-label="Página anterior" title="Ir a página anterior">
			&laquo;
		</a>
	{/if}

	<!-- Botones de las páginas -->
	{#if totalPages > 1 && total > itemsPerPage}
		{#each Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5) as _page}
			<a
				href={getUrl(_page)}
				class:active={_page === currentPage}
				aria-label={`Página ${_page}`}
				title="Ir a la página {_page}"
			>
				{_page}
			</a>
		{/each}
	{/if}

	<!-- Botón de página siguiente -->
	{#if currentPage < totalPages}
		<a href={getUrl(currentPage + 1)} aria-label="Página siguiente" title="Ir a página siguiente">
			&raquo;
		</a>
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
