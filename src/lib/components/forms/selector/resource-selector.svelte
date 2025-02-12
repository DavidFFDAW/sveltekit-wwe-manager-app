<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { errorimage } from '$lib/actions/error.image';
	import Icon from '$lib/components/icons/icon.svelte';

	interface Resource {
		id: number;
		name: string;
		image: string | null;
		status?: string;
	}
	export let list: Resource[] = [];

	let filters: Record<string, string> = {
		search: '',
		firstLetter: '',
		status: ''
	};

	export let name: string = '';
	export let selectedItem: number = 0;
	export let maxHeight: number = 512;
	export let afterSelection: (id: number) => void = () => {};
	const differentStatuses = [...new Set(list.map((resource) => resource.status))].sort();

	$: results = list
		.filter((resource) => resource.name.toLowerCase().includes(filters.search.toLowerCase()))
		.filter((resource) =>
			resource.name.toLowerCase().startsWith(filters.firstLetter.toLowerCase())
		);
	$: statusesFilter =
		differentStatuses.length > 2
			? results.filter((resource) =>
					resource.status?.toLowerCase().includes(filters.status.toLowerCase())
				)
			: results;
	$: selectedName = results.find((resource) => resource.id === selectedItem)?.name;

	const backspace = () => {
		filters.search = filters.search.slice(0, -1);
	};
	const reset = () => {
		filters.search = '';
		filters.firstLetter = '';
		filters.status = '';
	};
</script>

<div class="w1 resource-selector">
	<div class="search-container flex column gap-5">
		<div class="w1 flex">
			<input type="search" placeholder="Buscar recurso" bind:value={filters.search} />
			<button type="button" class="backspace small" on:click={backspace}>
				<Icon icon="backspace" />
			</button>
			<button type="button" on:click={reset} class="small">
				<Icon icon="x" />
			</button>
		</div>
		<div class="w1 extra-filters">
			<div class="w1 flex letters-container overflow-horizontal">
				{#each 'abcdefghijklmnopqrstuvwxyz'.split('') as letter}
					<button
						type="button"
						on:click={() => (filters.firstLetter = letter)}
						class="uppercase letter-btn small"
						class:active={filters.firstLetter === letter}
					>
						{letter}
					</button>
				{/each}
			</div>

			{#if differentStatuses.length > 1}
				<div class="w1 flex statuses-container overflow-horizontal">
					{#each differentStatuses as status}
						<button
							type="button"
							on:click={() => (filters.status = status || '')}
							class="uppercase letter-btn small"
							class:active={filters.status === status}
						>
							{status}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div
		style="--maxheight: {maxHeight}px;"
		class="resource-selector-list-container"
		class:has-selection={selectedItem !== 0}
		transition:fade
	>
		{#each statusesFilter as resource, index}
			<div
				class="w1 resource-item-radio-container"
				class:selected={selectedItem === resource.id}
				style="order: {index + 1}"
			>
				<label class="w1 block">
					<input
						type="radio"
						name={name ? `selected-${name}-resource-id` : 'selected-resource-id'}
						value={resource.id}
						bind:group={selectedItem}
						on:change={() => afterSelection(resource.id)}
					/>
					<div class="resource-item-radio-inner h1">
						<img src={resource.image} alt={resource.name} class="h1" use:errorimage />
						<div class="info-block">
							<span>{resource.name}</span>
							{#if resource.status}
								<p>{resource.status}</p>
							{/if}
						</div>
					</div>
				</label>
			</div>
		{/each}
	</div>

	{#if selectedName}
		<input
			type="hidden"
			name={name ? `selected-${name}-resource-name` : 'selected-resource-name'}
			value={selectedName}
		/>
	{/if}
</div>

<style>
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
	.letters-container {
		padding: 6px 0;
	}
	button.letter-btn.small {
		padding: 5px 8px;
		border-radius: 2px;
	}
	.letters-container button {
		width: 100%;
	}

	.resource-selector .search-container {
		padding: 0 10px;
	}

	.resource-selector .resource-selector-list-container {
		display: flex;
		padding: 5px 10px;
		flex-direction: column;
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
