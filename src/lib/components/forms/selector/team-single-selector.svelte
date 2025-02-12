<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import { WrestlerConstants } from '$lib/constants/wrestler.constants';

	type Resource = { id: number; name: string; image: string | null; status?: string };

	let search = '';
	let status = '';
	export let list: Resource[] = [];
	export let maxMembers: number = 5;
	export let hasExtraFilters: boolean = false;
	export let selectedMembers: Resource[] = [];

	const handleSelectedMembers = (resource: Resource) => {
		const memberId = resource.id;
		if (selectedMembers.some((member) => member.id === memberId)) {
			selectedMembers = selectedMembers.filter((member) => member.id !== memberId);
			return;
		}
		if (selectedMembers.length >= maxMembers) {
			selectedMembers = [...selectedMembers.slice(1), resource];
		} else {
			selectedMembers = [...selectedMembers, resource];
		}
	};

	$: filteredList = status
		? list
				.filter((resource) => resource.status === status)
				.filter((resource) => resource.name.toLowerCase().includes(search.toLowerCase()))
		: list.filter((resource) => resource.name.toLowerCase().includes(search.toLowerCase()));
	$: selectedMemberIds = selectedMembers.map((member) => member.id);
</script>

<div class="w1 team-single-selector-component-container">
	<div class="w1 search-container flex astart column gap-smaller">
		<div class="w1">
			<h4>Selecciona un máximo de {maxMembers} miembros</h4>
			<input type="search" placeholder="Buscar recurso" bind:value={search} />
		</div>
		{#if hasExtraFilters}
			<div class="w1 overflow-horizontal extra-filters-status-block">
				<div class="extra-filters-block flex start noalign gap-smaller">
					<button
						type="button"
						class="app-button"
						class:active={status === ''}
						on:click={() => (status = '')}
					>
						Todos
					</button>
					{#each WrestlerConstants.statuses as wrestlerStatus}
						<button
							type="button"
							class="app-button"
							class:active={status === wrestlerStatus.value}
							on:click={() => (status = wrestlerStatus.value)}
						>
							{wrestlerStatus.label}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="team-single-selector-list-container down">
		{#each filteredList as resource}
			<div class="w1 team-single-selector-item-container {resource.status}">
				<label class="w1 block relative">
					<input
						type="checkbox"
						class="app-checkbox app-check"
						name="selected-team-member[]"
						data-status={resource.status}
						value={resource.id}
						checked={selectedMemberIds.includes(resource.id)}
						on:change={() => handleSelectedMembers(resource)}
					/>
					<div class="team-single-selector-item-inner flex column noalign gap-0">
						<img src={resource.image} alt={resource.name} class="h1" use:errorimage />
						<div class="info-block">
							<span>{resource.name}</span>
						</div>
					</div>
				</label>
			</div>
		{/each}
	</div>
</div>

{#if selectedMembers.length > 0}
	<p class="w1 tcenter">Máximo de {maxMembers} miembros seleccionados</p>
	<div class="w1 flex start gap-medium selected-team-container">
		{#each selectedMembers as member}
			<div class="selected-member flex column">
				<img width="50" src={member.image} alt={member.name} class="h1" use:errorimage />
				<p>{member.name}</p>

				<input type="hidden" name="team-single-member-selector-id[]" value={member.id} />
				<input type="hidden" name="team-single-member-selector-name[]" value={member.name} />
			</div>
		{/each}
	</div>
{/if}

<style>
	.extra-filters-status-block .extra-filters-block {
		padding: 10px 0;
	}
	.extra-filters-status-block .extra-filters-block .app-button {
		margin: 0;
		padding: 1px 10px;
		font-size: 14px;
		background-color: #ddd;
		border-radius: 6px;
	}
	.extra-filters-status-block .extra-filters-block .app-button.active {
		background-color: var(--blue);
		color: #fff;
	}
	.team-single-selector-component-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.search-container {
		width: 100%;
	}

	.selected-team-container {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 1rem;
		background-color: #ddd;
		padding: 10px;
		border-radius: 6px;
	}
	.selected-team-container .selected-member {
		width: 100%;
		padding: 10px;
		text-align: center;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
		border-radius: 6px;
		background-color: #fff;
	}

	.team-single-selector-list-container {
		width: 100%;
		padding: 0 5px;
		max-height: 300px;
		overflow-x: hidden;
		overflow-y: auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
		gap: 10px;
	}

	.team-single-selector-item-container {
		width: 100%;
	}
	.team-single-selector-item-container
		label.relative
		input[type='checkbox']
		+ .team-single-selector-item-inner {
		height: 100%;
		border-radius: 8px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
		background-color: #e9e9e9;
		overflow: hidden;
		filter: grayscale(1);
	}

	.team-single-selector-item-container.legend
		label.relative
		input[type='checkbox']
		+ .team-single-selector-item-inner
		img {
		background: radial-gradient(circle, rgba(255, 255, 255, 1), var(--legend));
	}

	.team-single-selector-item-container
		label.relative
		input[type='checkbox']
		+ .team-single-selector-item-inner
		span {
		display: block;
		padding: 0 6px;
		border-radius: 0 0 8px 8px;
		border-top: 1px solid #333;
		white-space: nowrap;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.team-single-selector-item-container
		label.relative
		input[type='checkbox']:checked
		+ .team-single-selector-item-inner {
		border: 2px solid var(--blue);
		background-color: #fff;
		filter: grayscale(0);
	}
</style>
