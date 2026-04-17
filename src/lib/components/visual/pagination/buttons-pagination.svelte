<script lang="ts">
	import { page } from '$app/state';

	let { page: _page, class: css = '' } = $props();
	let input_page = $state(_page);
	let path = $derived(page.url.pathname);
	$inspect(_page, path);
</script>

<div class="w1 pagination-block slim-pagination-buttons {css}">
	{#if _page > 1}
		<a
			href="{path}?page={_page - 1}"
			class="btn small"
			data-disabled={_page <= 1}
			aria-label="Página anterior"
		>
			<i class="bi bi-chevron-left"></i>
		</a>
	{/if}

	<span class="btn small" aria-label={`Página actual ${_page}`}>
		{_page}
	</span>

	<form method="get" class="inline-flex gap-1" aria-label="Ir a página específica">
		<input min="1" type="number" name="page" bind:value={input_page} />
		<button type="submit" class="btn small" aria-label="Ir a página">
			<i class="bi bi-search"></i>
		</button>
	</form>

	<a href="{path}?page={_page + 1}" class="btn small" aria-label="Página siguiente">
		<i class="bi bi-chevron-right"></i>
	</a>
</div>

<style>
	.pagination-block.slim-pagination-buttons {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 0.5rem;
		margin: 10px 0;
	}
	.pagination-block.slim-pagination-buttons .btn {
		padding: 6px 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: white;
		cursor: pointer;
		font-size: 1rem;
		text-decoration: none;
		color: inherit;
	}
	.pagination-block.slim-pagination-buttons .btn[disabled] {
		background-color: #f0f0f0;
		color: #333;
		cursor: not-allowed;
	}
</style>
