<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';

	interface HorizontalListSelectProps {
		title: string;
		list: { id: number; name: string; image: string }[];
		maxVisibleItems?: number;
		value?: number;
		fallback?: string;
		name: string;
	}

	let isDown = $state(false);
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	let search = $state<string>('');
	let {
		list,
		name,
		title,
		maxVisibleItems = 10,
		value = $bindable<number>(),
		fallback = '/noimage.webp'
	}: HorizontalListSelectProps = $props();
	let selectedLetter = $state<string>('');

	let filtered = $derived.by(() => {
		if (!selectedLetter && search.length < 3 && value) {
			const selectedItem = list.find((item) => item.id === value);
			if (selectedItem) {
				return [selectedItem, ...list.filter((item) => item.id !== value)].slice(0, maxVisibleItems);
			}
		}

		const letterFilter =
			selectedLetter !== ''
				? list.filter((item) => item.name.toLowerCase().startsWith(selectedLetter))
				: list;
		if (search.length < 3) return letterFilter.slice(0, maxVisibleItems);
		return letterFilter
			.filter((item) => item.name.toUpperCase().includes(search.toUpperCase()))
			.slice(0, maxVisibleItems);
	});

	function handleMouseDown() {
		isDown = true;
	}

	function handleMouseLeaveOrUp() {
		isDown = false;
	}

	function clearSelection() {
		value = 0;
		selectedLetter = '';
		search = '';
	}
</script>

<div class="horizontal-list-select">
	<header class="horizontal-selector-header">
		<span class="title-icon">
			<i class="bi bi-grid-3x3-gap-fill" aria-hidden="true"></i>
		</span>
		<h3>{title}</h3>
	</header>

	<div class="search-container">
		<label class="search-field">
			<i class="bi bi-search" aria-hidden="true"></i>
			<input
				type="search"
				bind:value={search}
				placeholder="Buscar por nombre..."
				aria-label="Buscar por nombre"
			/>
		</label>
	</div>

	<div class="letters">
		{#each letters as letter}
			<button type="button" class="letter" onclick={() => (selectedLetter = letter.toLowerCase())}>
				{letter}
			</button>
		{/each}
	</div>

	<div class="results-toolbar">
		<p class="results-count" role="status">
			<i class="bi bi-list-ul" aria-hidden="true"></i>
			<span>Mostrando <strong>{filtered.length}</strong> de {list.length} elementos</span>
		</p>
		<button type="button" class="clear-selection" onclick={clearSelection} disabled={!value}>
			<i class="bi bi-x-circle" aria-hidden="true"></i>
			Deseleccionar
		</button>
	</div>

	<div
		role="presentation"
		class="horizontal-list"
		class:grabbing={isDown}
		aria-label="Horizontal list of items"
		onmousedown={handleMouseDown}
		onmouseleave={handleMouseLeaveOrUp}
		onmouseup={handleMouseLeaveOrUp}
	>
		{#each filtered as item (item.id)}
			<label class="horizontal-selector-item">
				<input type="radio" {name} value={item.id} checked={value === item.id} bind:group={value} />
				<span class="item-card">
					<span class="selection-indicator" aria-hidden="true">
						<i class="bi bi-check-lg"></i>
					</span>
					<span class="item-portrait">
						<img src={item.image} alt="" use:errorimage={fallback} draggable="false" />
					</span>
					<span class="item-name">{item.name}</span>
				</span>
			</label>
		{/each}
	</div>
</div>

<style>
	.horizontal-list-select {
		--item-width: 200px;
		min-width: 0;
		background: #fff;
		border: 1px solid #eee;
		border-radius: 14px;
		overflow-x: hidden;
		padding: 16px;
	}
	.horizontal-selector-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-bottom: 16px;
		border-bottom: 1px solid #e5e7eb;
	}
	.title-icon {
		display: grid;
		place-items: center;
		flex: 0 0 40px;
		height: 40px;
		border-radius: 12px;
		background: #fff6dd;
		color: #8a6400;
		font-size: 20px;
	}
	.horizontal-selector-header h3 {
		margin: 0;
		color: #151c2d;
		font-size: 20px;
		font-weight: 700;
		line-height: 1.3;
		overflow-wrap: anywhere;
	}
	.search-container {
		padding-block: 16px;
	}
	.search-field {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 12px;
		border: 1px solid #d1d5db;
		border-radius: 10px;
		background: #f8fafc;
		color: #64748b;
	}
	.search-field:focus-within {
		border-color: #b58a22;
		box-shadow: 0 0 0 3px #f4c84f33;
		background: #fff;
	}
	.search-field input {
		width: 100%;
		min-width: 0;
		min-height: 44px;
		margin: 0;
		padding: 10px 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: #151c2d;
		font: inherit;
		font-size: 14px;
		box-shadow: none;
		outline: none;
	}
	.search-field input::placeholder {
		color: #64748b;
	}
	.letters {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
		padding-block: 10px;
		border-block: 1px solid #e5e7eb;
	}
	.letters button.letter {
		flex: 0 0 auto;
		display: inline-block;
		margin: 2px;
		padding: 4px 8px;
		border: 1px solid #eee;
		border-radius: 8px;
		background: #fff;
		cursor: pointer;
	}
	.results-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 8px 16px;
		margin: 12px 4px 0;
	}
	.clear-selection {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-left: auto;
		padding: 6px 9px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		background: #fff;
		color: #64748b;
		font: inherit;
		font-size: 12px;
		cursor: pointer;
	}
	.clear-selection:hover {
		background: #fff6dd;
		border-color: #d8c9a1;
		color: #8a6400;
	}
	.clear-selection:focus-visible {
		outline: 2px solid #8a6400;
		outline-offset: 2px;
	}
	.clear-selection:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.results-count {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		font-size: 12px;
		line-height: 1.5;
		color: #64748b;
	}
	.results-count strong {
		color: #8a6400;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.horizontal-list {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		-ms-overflow-style: none;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
		padding: 16px 4px 8px;
		gap: 12px;
	}
	.horizontal-list.grabbing {
		scroll-behavior: auto;
		user-select: none;
		touch-action: none;
		cursor: grabbing;
	}

	@media (min-width: 800px) {
		.horizontal-list {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--item-width)), 1fr));
			overflow-x: visible;
			scroll-snap-type: none;
		}
	}

	.horizontal-selector-item {
		position: relative;
		min-width: 0;
		flex: 0 0 var(--item-width);
		cursor: pointer;
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}
	.horizontal-selector-item input[type='radio'] {
		position: absolute;
		inset: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}
	.item-card {
		display: flex;
		position: relative;
		box-sizing: border-box;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 8px 8px 18px;
		gap: 14px;
		text-align: center;
		background: linear-gradient(145deg, #f1f5f9, #fff 70%);
		border: 2px solid #e2e8f0;
		border-radius: 16px;
		box-shadow: 0 2px 5px #0f172a0a;
		transition:
			border-color 150ms,
			background 150ms,
			box-shadow 150ms;
	}
	.item-portrait {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		width: 100%;
		height: 150px;
		flex-shrink: 0;
		padding: 12px 12px 0;
		box-sizing: border-box;
		overflow: hidden;
		border-radius: 10px;
		background: radial-gradient(ellipse at 50% 70%, #fff 0%, #e2e8f0 85%);
		border-bottom: 1px solid #dbe2ea;
	}
	.item-portrait img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center bottom;
		filter: drop-shadow(0 4px 5px #0f172a1a);
	}
	.horizontal-selector-item input:checked + .item-card .item-portrait {
		background: radial-gradient(ellipse at 50% 70%, #fffaf0 0%, #f3dfa2 85%);
		border-bottom-color: #dcc27a;
	}
	.item-name {
		box-sizing: border-box;
		padding-inline: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 100%;
		font-size: 17px;
		font-weight: 800;
		line-height: 1.25;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		text-wrap: balance;
		color: #151c2d;
		overflow-wrap: anywhere;
	}
	.item-name::before {
		content: '';
		width: 28px;
		height: 3px;
		border-radius: 999px;
		background: #cbd5e1;
	}
	.horizontal-selector-item input:checked + .item-card .item-name {
		color: #785609;
	}
	.horizontal-selector-item input:checked + .item-card .item-name::before {
		background: #b58a22;
	}
	.selection-indicator {
		z-index: 1;
		pointer-events: none;
		position: absolute;
		top: 10px;
		right: 10px;
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border: 2px solid #cbd5e1;
		border-radius: 50%;
		background: #fff;
		color: #151c2d;
	}
	.selection-indicator i {
		visibility: hidden;
	}
	.horizontal-selector-item input:hover + .item-card {
		border-color: #b58a22;
		box-shadow: 0 4px 12px #0f172a14;
	}
	.horizontal-selector-item input:checked + .item-card {
		border-color: #b58a22;
		background: linear-gradient(145deg, #fff0bd, #fffaf0);
		box-shadow: 0 3px 10px #b58a2226;
	}
	.horizontal-selector-item input:checked + .item-card .selection-indicator {
		background: #f4c84f;
		border-color: #b58a22;
	}
	.horizontal-selector-item input:checked + .item-card .selection-indicator i {
		visibility: visible;
	}
	.horizontal-selector-item input:focus-visible + .item-card {
		outline: 2px solid #8a6400;
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		.item-card {
			transition: none;
		}
	}
</style>
