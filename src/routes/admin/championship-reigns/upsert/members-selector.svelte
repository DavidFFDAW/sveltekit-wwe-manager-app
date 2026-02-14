<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';

	const perpage = 20;
	let page = $state(1);
	let letter = $state('');
	let search = $state('');
	let { list, selected = $bindable(null), name, map } = $props();
	let selectedWrestlers = $derived.by(() => {
		if (!selected) return [];
		return selected.map((id: number) => map.get(id)).filter(Boolean);
	});

	let start = $derived((page - 1) * perpage);
	let filteredList = $derived(
		letter
			? list.filter((item: any) =>
					item.slug.toString().toLowerCase().startsWith(letter.toLowerCase())
				)
			: list
	);
	let searchedList = $derived.by(() => {
		if (!search) return filteredList;
		if (search.length < 3) return filteredList;
		return filteredList.filter((item: any) =>
			item.name.toString().toLowerCase().includes(search.toLowerCase())
		);
	});
	let pages = $derived(
		Array.from({ length: Math.ceil(searchedList.length / perpage) }, (_, i) => i + 1)
	);
	let pagedList = $derived(searchedList.slice(start, start + perpage));
</script>

<div class="w1 custom-app-box sortable-list list-with-pagination">
	<header>
		<div class="selected-members-preview">
			{#each selectedWrestlers as item}
				<li class="w1 block" data-slug={item.slug}>
					<label class="relative">
						<input
							type="checkbox"
							{name}
							class="app-checkbox"
							value={item.id}
							bind:group={selected}
						/>
						<div class="manual-team-member">
							<img
								src={item.image_name}
								alt={item.name as string}
								class="championship-image"
								data-type-image={'wrestler'}
								data-type={'wrestler'}
								use:errorimage={'/vacant.webp'}
								width={30}
								height={30}
							/>
							<span class="championship-name">{item.name}</span>
							<button type="button" class="btn-clear" aria-label="Remover">
								<i class="bi bi-x"></i>
							</button>
						</div>
					</label>
				</li>
			{/each}
		</div>
		<div class="flex start acenter gap-5">
			<input type="search" placeholder="Buscar..." class="input" bind:value={search} />
		</div>
		<div class="w1 letters-pagination flex gap-5 acenter">
			<label class="relative">
				<input
					type="radio"
					name="letter"
					class="app-radio"
					value=""
					checked={letter === ''}
					bind:group={letter}
				/>
				<div class="inner btn small">Todos</div>
			</label>
			{#each 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') as l}
				<label class="relative">
					<input
						type="radio"
						name="letter"
						class="app-radio"
						value={l}
						checked={letter === l}
						bind:group={letter}
					/>
					<div class="inner btn small">
						{l}
					</div>
				</label>
			{/each}
		</div>
		{#if pages.length > 1}
			<div class="real-pagination">
				{#each pages as p}
					<button
						type="button"
						class="btn small secondary"
						class:cta={p === page}
						onclick={() => (page = p)}
					>
						{p}
					</button>
				{/each}
			</div>
		{/if}
	</header>

	<div class="list-container">
		<ul class="items-list flex column gap-smaller astart">
			{#each pagedList as item}
				<li class="w1 block" data-slug={item.slug}>
					<label class="relative">
						<input
							type="checkbox"
							{name}
							class="app-checkbox"
							value={item.id}
							bind:group={selected}
						/>
						<div class="item-selector inner flex acenter gap-5">
							<img
								src={item.image}
								alt={item.name as string}
								class="championship-image"
								data-type-image={'wrestler'}
								data-type={'wrestler'}
								use:errorimage={'/vacant.webp'}
								width={60}
								height={30}
							/>
							<span class="championship-name">{item.name}</span>
						</div>
					</label>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.w1.custom-app-box.sortable-list.list-with-pagination ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 10px;
	}
	.custom-app-box {
		min-height: 100%;
		max-height: 100%;
		overflow-y: auto;
		/* padding: 10px; */
		padding-right: 10px;
		/* border: 1px solid #ddd;
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.2); */
		border-radius: 12px;
	}
	.letters-pagination {
		max-width: 100%;
		overflow-x: auto;
		padding: 5px 0;
	}

	.list-container {
		padding: 10px 0;
	}

	.item-selector.inner {
		display: flex;
		gap: 12px;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 8px;
		cursor: pointer;
		box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
	}
	label input[type='radio']:checked + .inner.item-selector {
		border-color: #000;
		background-color: #f0f0f0;
		box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
	}

	.letters-pagination label input[type='radio']:checked + .inner {
		border-color: #000;
		background-color: #000;
		color: #fff;
	}

	.custom-app-box.sortable-list.list-with-pagination header {
		position: sticky;
		top: -10px;
		background: #fff;
		padding: 10px;
		border-bottom: 2px solid #000;
		z-index: 1;
	}

	.real-pagination {
		display: flex;
		gap: 5px;
		max-width: 100%;
		overflow-x: auto;
		padding: 5px 0;
	}

	.selected-members-preview {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		padding: 10px 0;
		gap: 6px;
	}
	.selected-members-preview .manual-team-member {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 20px;
		border-radius: 25px;
		border: 2px solid #ddd;
		background-color: #fff;
	}

	.selected-members-preview .manual-team-member .btn-clear {
		margin-left: 10px;
		padding: 2px 6px;
		border-radius: 50%;
		border: none;
		background-color: #eee;
		color: #333;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
</style>
