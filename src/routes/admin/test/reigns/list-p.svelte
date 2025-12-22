<script lang="ts">
	let searchTerm: string = $state('');
	let { list, selectedId = $bindable(null) } = $props();
	let filteredList = $derived(
		list.filter((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	let page = $state(0);
	let itemsPerPage = $state(10);
	let paginatedList = $derived(filteredList.slice(page * itemsPerPage, (page + 1) * itemsPerPage));
</script>

<div class="sortable-ui selectable-list">
	<span>{paginatedList.length} items</span>
	<input type="search" bind:value={searchTerm} />

	<ul class="sortable-list">
		{#each paginatedList as item}
			<li class="sortable-item">
				<label class="selectable-item relative" data-id={item.id}>
					<input type="radio" class="app-radio" value={item.id} bind:group={selectedId} />
					<div class="inner radio-inner">
						{item.name}
					</div>
				</label>
			</li>
		{/each}
	</ul>

	{#if filteredList.length > itemsPerPage}
		<div class="pagination-controls flex acenter gap-5 justify-center mt-5">
			<button
				class="btn btn small rounded"
				onclick={() => (page = Math.max(0, page - 1))}
				disabled={page === 0}
			>
				Previous
			</button>
			<button
				class="btn btn small rounded"
				onclick={() =>
					(page = Math.min(page + 1, Math.floor((filteredList.length - 1) / itemsPerPage)))}
				disabled={(page + 1) * itemsPerPage >= filteredList.length}
			>
				Next
			</button>
		</div>
	{/if}
</div>
