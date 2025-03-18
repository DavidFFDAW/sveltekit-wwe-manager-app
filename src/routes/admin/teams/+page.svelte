<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncButton from '$lib/components/buttons/async-button.svelte';
	import Radio from '$lib/components/forms/inputs/radio.svelte';
	import SearchForm from '$lib/components/forms/search-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import TeamActions from './team-actions.svelte';

	export let data;
	let selectedStatus: string = data.params.status || 'all';
	const maximumScrollableItems = 2;
</script>

<PageWrapper page="admin-teams">
	<div class="w1 flex end">
		<AsyncButton
			url="/api/teams/gender/refresh"
			method="post"
			classes="btn cta"
			text="Comprobar géneros de equipos"
			icon="gender-ambiguous"
		/>
	</div>

	<div class="search-container">
		<SearchForm>
			<div class="w1 block">
				<div class="form-item">
					<label class="label" for="search">Busqueda por equipo o luchador</label>
					<input
						type="search"
						id="search"
						name="search"
						maxlength="255"
						placeholder="Nombre de equipo o luchador miembro de equipo"
						value={data.params.name}
					/>
				</div>
			</div>

			<div class="w1 status-selector flex gap-smaller">
				<Radio bind:group={selectedStatus} name="status" value="all" label="Todos" />
				<Radio bind:group={selectedStatus} name="status" value="active" label="Solo activos" />
				<Radio bind:group={selectedStatus} name="status" value="inactive" label="Solo inactivos" />
			</div>
		</SearchForm>
	</div>

	<input type="text" />

	<div class="page-list-container grid grid-three-column gap-medium responsive">
		{#each data.teams as team}
			<div class="block box relative team-box shadow {team.active ? 'active' : 'inactive'}">
				<div class="whole-content">
					<div class="images-slider">
						<div
							class="images-container"
							class:scrollable={team.WrestlerTeam.length > maximumScrollableItems}
						>
							{#each team.WrestlerTeam as wt}
								<div class="flex column image-name-container">
									<img
										use:errorimage={'/vacant.webp'}
										src={wt.Wrestler.image_name}
										alt={wt.Wrestler.name}
									/>
									<small>{wt.Wrestler.name}</small>
								</div>
							{/each}
						</div>
					</div>

					<div class="name-block w1 flex center acenter column nogap">
						<h3 class="w1 block tcenter">{team.name}</h3>
						{#if team.ChampionshipReign.length > 0}
							<small>Han tenido {team.ChampionshipReign.length} reinados como campeones</small>
						{/if}
					</div>
				</div>

				<div class="absolute top right">
					<TeamActions {team} />
				</div>
			</div>
		{/each}
	</div>
</PageWrapper>

<style>
	.box.team-box.inactive .whole-content {
		opacity: 0.5;
		filter: grayscale(100%);
	}
	.images-slider {
		overflow: hidden;
		width: 100%;
		overflow-x: auto;
	}
	.images-container {
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
	.images-container.scrollable {
		justify-content: flex-start;
	}
	.images-container img {
		width: 150px;
		margin-right: 0.5rem;
	}

	.name-block {
		margin-top: 0.5rem;
		padding: 5px;
		border-top: 1px solid #ccc;
	}
</style>
