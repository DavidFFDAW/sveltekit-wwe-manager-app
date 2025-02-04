<script lang="ts">
	import { fade } from 'svelte/transition';
	import { errorimage } from '$lib/actions/error.image';

	interface Resource {
		id: number;
		name: string;
		image: string | null;
		status?: string;
	}
	export let list: Resource[] = [];

	let search = '';
	export let name: string = '';
	export let selectedItem: number = 0;
	export let maxHeight: number = 512;
	export let afterSelection: (id: number) => void = () => {};

	$: results = list.filter((resource) =>
		resource.name.toLowerCase().includes(search.toLowerCase())
	);
	$: selectedName = results.find((resource) => resource.id === selectedItem)?.name;
</script>

<div class="w1 resource-selector">
	<div class="search-container">
		<input type="search" placeholder="Buscar recurso" bind:value={search} />
	</div>

	<div
		style="--maxheight: {maxHeight}px;"
		class="resource-selector-list-container"
		class:has-selection={selectedItem !== 0}
		transition:fade
	>
		{#each results as resource, index}
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
			name={name ? `selected-${name}-resource-name` : 'selected-editor-resource-name'}
			value={selectedName}
		/>
	{/if}
</div>

<style>
	.resource-selector {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		padding: 10px 0;
		border-radius: 6px;
		gap: 10px;
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
