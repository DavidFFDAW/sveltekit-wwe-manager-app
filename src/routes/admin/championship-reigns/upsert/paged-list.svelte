<script lang="ts">
	import Image from '$lib/components/visual/image.svelte';

	const perpage = 20;
	let page = $state(1);
	let letter = $state('');
	let { type = 'championship', list, selected = $bindable(null), name } = $props();

	let start = $derived((page - 1) * perpage);
	let pages = $derived(Array.from({ length: Math.ceil(list.length / perpage) }, (_, i) => i + 1));
	let filteredList = $derived(
		letter
			? list.filter((item: any) =>
					item.name.toString().toLowerCase().startsWith(letter.toLowerCase())
				)
			: list
	);
	let pagedList = $derived(filteredList.slice(start, start + perpage));
</script>

<div class="w1 custom-app-box sortable-list list-with-pagination">
	<header>
		<input type="search" placeholder="Buscar..." class="input" />
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
				<li class="w1 block">
					<label class="relative">
						<input
							type="radio"
							{name}
							class="app-radio"
							value={item.id}
							checked={selected === item.id}
							bind:group={selected}
						/>
						<div class="item-selector inner flex acenter gap-5">
							<Image
								src={item.image}
								alt={item.name as string}
								class="championship-image"
								data-type-image={type}
								type={type === 'championship' ? 'championship' : 'wrestler'}
								fallback={`/${type === 'championship' ? 'unknown-championship' : 'vacant'}.webp`}
								width={type === 'championship' ? 100 : 60}
								height={type === 'championship' ? 50 : 30}
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
	.custom-app-box {
		min-height: 100%;
		max-height: 100%;
		overflow-y: auto;
		padding: 10px;
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
		border-radius: 12px;
		border: 1px solid #ddd;
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

	.real-pagination {
		display: flex;
		gap: 5px;
		max-width: 100%;
		overflow-x: auto;
		padding: 5px 0;
	}
</style>
