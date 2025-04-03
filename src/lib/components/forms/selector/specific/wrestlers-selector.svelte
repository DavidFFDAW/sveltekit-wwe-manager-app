<script lang="ts">
	import type { Wrestler } from '@prisma/client';
	import { fade, slide } from 'svelte/transition';
	import { errorimage } from '$lib/actions/error.image';
	import Icon from '$lib/components/icons/icon.svelte';
	import { WrestlerConstants } from '$lib/constants/wrestler.constants';
	export let list: Wrestler[] = [];

	let filters: Record<string, string> = {
		search: '',
		firstLetter: '',
		status: ''
	};

	let showFilters: boolean = false;
	export let name: string = '';
	export let selectedItem: number = 0;
	export let itemWidth: number = 200;
	export let maxHeight: number = 512;
	export let afterSelection: ((id: number) => void) | null = null;

	const getFilteredList = () => {
		return list.filter((item) => {
			const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase());
			const matchesStatus = filters.status ? item.status === filters.status : true;
			return matchesSearch && matchesStatus;
		});
	};

	const toggleFilters = () => {
		showFilters = !showFilters;
	};

	let filteredList = list;
	$: filters.search, filters.status, list, (filteredList = getFilteredList());
</script>

<div class="w1 resource-selector">
	<div class="w1 relative search-container flex column gap-5">
		<div class="w1 flex">
			<input type="search" placeholder="Buscar recurso" bind:value={filters.search} />
			<button type="button" on:click={toggleFilters} class="btn btn-filters small">
				<Icon icon={showFilters ? 'x' : 'filter'} classes="icon-big icon-filters" />
			</button>
		</div>

		{#if showFilters}
			<div class="w1 hidden-filters extra-filters" transition:slide>
				<div class="w1 extra-filter-item">
					<div class="form-item extra-filter-item-label">
						<span class="label form-label">Estado</span>
					</div>
					<div class="w1 statuses-container flex gap-5">
						{#each WrestlerConstants.statuses as status}
							<button
								type="button"
								class="btn small"
								class:active={filters.status === status.value}
								on:click={() => {
									filters.status = filters.status === status.value ? '' : status.value;
								}}
							>
								{status.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div
		style="--maxheight: {maxHeight}px; --itemwidth: {itemWidth}px;"
		class="resource-selector-list-container"
		class:has-selection={selectedItem !== 0}
		class:has-filters={showFilters}
		transition:fade
	>
		{#each filteredList as resource, index}
			<div
				class="w1 resource-item-radio-container wrestler-item-{resource.brand}"
				class:selected={selectedItem === resource.id}
				style="order: {index + 1}"
			>
				<label class="w1 block">
					<input
						type="radio"
						name={name ? `selected-${name}-resource-id` : 'selected-resource-id'}
						value={resource.id}
						bind:group={selectedItem}
						on:change={() => afterSelection && afterSelection(resource.id)}
					/>
					<div class="resource-item-radio-inner h1">
						<img
							class="h1"
							data-image-src={resource.image_name as string}
							src={resource.image_name as string}
							alt={resource.name}
							use:errorimage={'/vacant.webp'}
						/>
						<div class="realative info-block flex astart column nogap">
							<span>{resource.name}</span>
							{#if resource.status}
								<small>Estado: {resource.status}</small>
							{/if}
							<small>Media: {resource.overall}</small>

							<div class="brand-block brand-{resource.brand}"></div>
						</div>
					</div>
				</label>
			</div>
		{/each}
	</div>
</div>

<style>
	.resource-selector-list-container.has-filters {
		min-height: auto;
	}
	.btn.btn-filters.small {
		padding: 5px 6px;
		width: 20%;
		border-radius: 2px;
		background-color: #fff;
		border: 1px solid var(--blue);
		border-radius: 4px;
		color: var(--blue);
		cursor: pointer;
	}
	.hidden-filters.extra-filters {
		/* position: absolute; */
		position: relative;
		display: flex;
		flex-direction: column;
		margin-top: 10px;
		gap: 10px;
		top: 100%;
		left: 1px;
		width: calc(100% - 1px);
		background-color: #fff;
		padding: 10px 0;
		z-index: 10;
		border-bottom: 2px solid var(--blue);
	}
	.hidden-filters.extra-filters .extra-filter-item {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.extra-filters .statuses-container {
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}
	.extra-filters .statuses-container button {
		width: 100%;
		min-width: 100px;
	}
	.resource-selector {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		padding: 10px 0;
		border-radius: 6px;
		gap: 10px;
	}

	button.small {
		padding: 5px 6px;
		border-radius: 2px;
	}
	button.small.active {
		background-color: var(--blue);
		color: #fff;
	}

	.resource-selector .resource-selector-list-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--itemwidth), 1fr));
		padding: 5px 10px;
		max-height: var(--maxheight);
		overflow-x: hidden;
		overflow-y: auto;
		gap: 10px;
	}

	.resource-item-radio-container.selected {
		order: 0 !important;
	}

	.resource-item-radio-container label {
		position: relative;
		display: block;
		width: 100%;
		height: 80px;
		cursor: pointer;
		background-color: #e9e9e9;
		border-radius: 10px;
	}

	.resource-item-radio-container input[type='radio'] {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	.resource-item-radio-container input[type='radio'] + .resource-item-radio-inner {
		display: flex;
		align-items: center;
		padding: 5px;
		border-radius: 10px;
		overflow: hidden;
		gap: 15px;
	}

	.resource-item-radio-container input[type='radio'] + .resource-item-radio-inner img {
		max-width: 85px;
		background-color: #fff;
		border-radius: 6px;
	}
	.resource-item-radio-container input[type='radio'] + .resource-item-radio-inner span {
		font-size: 15px;
		text-transform: uppercase;
		font-weight: 600;
		/* font-family: 'dreadnotus', sans-serif; */
	}

	.resource-item-radio-container input[type='radio']:checked + .resource-item-radio-inner {
		background-color: #f0f0f0;
		border: 2px solid var(--blue);
		animation: pulse 1s linear infinite;
	}

	.resource-item-radio-container.wrestler-item-raw .resource-item-radio-inner {
		background: linear-gradient(-45deg, var(--raw) 0%, transparent 50%);
	}

	.resource-item-radio-container.wrestler-item-smackdown .resource-item-radio-inner {
		background: linear-gradient(-45deg, var(--smackdown) 0%, transparent 50%);
	}

	.resource-item-radio-container.wrestler-item-awl .resource-item-radio-inner {
		background: linear-gradient(-45deg, var(--awl) 0%, transparent 50%);
	}

	.brand-block {
		position: absolute;
		width: 60px;
		height: auto;
		top: 50%;
		right: 5px;
		padding: 25px;
		transform: translateY(-50%);
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center center;
		opacity: 0.6;
	}

	.brand-block.brand-raw {
		background-image: url('/brands/raw.webp');
	}

	.brand-block.brand-smackdown {
		background-image: url('/brands/smackdown.webp');
	}

	.brand-block.brand-awl {
		background-image: url('/brands/awl.webp');
	}

	@media (max-width: 768px) {
		.resource-selector .resource-selector-list-container {
			grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
		}
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.02);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
