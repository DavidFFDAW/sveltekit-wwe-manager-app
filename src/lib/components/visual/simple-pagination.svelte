<script lang="ts">
	export let pages: number[];
	export let current: number;
</script>

<div class="w1 flex end pagination pagination-container">
	<div class="flex gap-small pagination-wrapper">
		{#each pages as page}
			<div class="pagination-item">
				{#if page === current}
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
						aria-label={`Página ${page}`}
						title="Ir a la página {page}"
					>
						{page}
					</a>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.pagination.pagination-container {
		margin-bottom: 6px;
	}
	.pagination.pagination-container .pagination-wrapper {
		gap: 0.5rem;
	}
	.pagination.pagination-container .pagination-wrapper .pagination-item .pagination-link {
		display: inline-block;
		padding: 6px 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: white;
		cursor: pointer;
		font-size: 1rem;
		text-decoration: none;
		color: inherit;
	}
	.pagination.pagination-container .pagination-wrapper .pagination-item .pagination-link.active {
		background-color: #007bff;
		color: white;
		font-weight: bold;
		border-color: #007bff;
	}
</style>
