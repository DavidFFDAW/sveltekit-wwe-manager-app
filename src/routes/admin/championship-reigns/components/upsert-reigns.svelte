<script lang="ts">
	import type {
		UpserReignChampionship,
		UpserReignWrestler,
		UpsertReign,
		UpsertReignTeams
	} from '../interfaces/reigns.interfaces';
	import Box from '$lib/components/box/box.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import ResourceSelector from '$lib/components/forms/selector/resource-selector.svelte';
	import TeamSelection from './team-selection.svelte';
	import ViewButtons from './view-buttons.svelte';
	import { errorimage } from '$lib/actions/error.image';
	import { scrollToElement } from '$lib/utils/dom.utils';
	import Icon from '$lib/components/icons/icon.svelte';
	import TeamSingleSelector from '$lib/components/forms/selector/team-single-selector.svelte';
	import UpsertCommonDatas from './upsert-common-datas.svelte';

	export let reign: UpsertReign = {} as UpsertReign;
	export let championships: UpserReignChampionship[] = [];
	export let wrestlers: UpserReignWrestler[] = [];
	export let teams: UpsertReignTeams[] = [];
	export let ppvs: string[] = [];

	let view: 'single' | 'team' | 'no-team' = 'single';
	const isUpdate = Boolean(reign.id);

	let selectedChampionshipID = reign.championship_id;
	let selectedWrestlerID = reign.wrestler_id;
	let selectedTeamMembers = reign.partner ? [reign.wrestler_id, reign.partner] : [];
	if (reign.team_id && reign.Championship && reign.Championship.tag) {
		view = 'team';
	}
	if (!reign.team_id && reign.Championship && reign.Championship.tag) {
		view = 'no-team';
	}

	$: selectedChampionship = championships.find(
		(championship) => championship.id === selectedChampionshipID
	);
</script>

<div class="w1 flex column astart gap">
	{#if !isUpdate}
		<ViewButtons bind:view />
	{/if}

	<div class="w1 championship-reign-upsert-component grid grid-two-column gap-medium responsive">
		<!-- abstract page parts into components, please -->

		{#if view === 'single'}
			<Box icon="info-circle" title="Titulo">
				{#if isUpdate}
					<div class="championship-selected">
						<img src={reign.Championship.image} alt={reign.Championship.name} use:errorimage />
						<p class="w1 tcenter">{reign.Championship.name}</p>
					</div>
				{:else}
					<ResourceSelector
						list={championships
							.filter((championship) => !championship.tag)
							.map((championship) => ({
								...championship,
								status: ''
							}))}
						bind:selectedItem={selectedChampionshipID}
						name="championship-reign"
						maxHeight={350}
					/>
				{/if}
				<div class="w1 flex end">
					<button
						type="button"
						class="btn cta navigation-button"
						on:click={() => scrollToElement('.navigate-to-wrestlers')}
					>
						<Icon icon="arrow-down" />
						Seleccionar luchador
					</button>
				</div>
			</Box>

			<Box icon="info-circle" title="Luchador" classes="navigate-to-wrestlers">
				<ResourceSelector
					list={selectedChampionship
						? wrestlers.filter((wrestler) => wrestler.gender === selectedChampionship?.gender)
						: wrestlers}
					bind:selectedItem={selectedWrestlerID}
					name="wrestler-reign"
					maxHeight={350}
				/>
				<div class="w1 flex end">
					<button
						type="button"
						class="btn cta navigation-button"
						on:click={() => scrollToElement('#common-reign-data')}
					>
						<Icon icon="arrow-down" />
						Datos comunes
					</button>
				</div>
			</Box>
		{/if}

		{#if view === 'team'}
			<Box icon="info-circle" title="Titulo">
				{#if isUpdate}
					<div class="championship-selected">
						<img src={reign.Championship.image} alt={reign.Championship.name} use:errorimage />
						<p class="w1 tcenter">{reign.Championship.name}</p>
					</div>
				{:else}
					<ResourceSelector
						list={championships.filter((championship) => championship.tag)}
						bind:selectedItem={selectedChampionshipID}
						name="championship-reign"
						maxHeight={350}
					/>
					<div class="w1 flex end">
						<button
							type="button"
							class="btn cta navigation-button"
							on:click={() => scrollToElement('.navigate-to-teams')}
						>
							<Icon icon="arrow-down" />
							Seleccionar equipo
						</button>
					</div>
				{/if}
			</Box>

			<Box icon="info-circle" title="Equipo" classes="navigate-to-teams">
				<TeamSelection
					{teams}
					name="tag-team-reign"
					selectedTeam={reign.team_id ? reign.team_id : 0}
					bind:selectedTeamMembers
				/>
				<div class="w1 flex end">
					<button
						type="button"
						class="btn cta navigation-button"
						on:click={() => scrollToElement('#common-reign-data')}
					>
						<Icon icon="arrow-down" />
						Datos comunes
					</button>
				</div>
			</Box>
		{/if}

		{#if view === 'no-team'}
			<Box icon="info-circle" title="Titulo">
				{#if isUpdate}
					<div class="championship-selected">
						<img src={reign.Championship.image} alt={reign.Championship.name} use:errorimage />
						<p class="w1 tcenter">{reign.Championship.name}</p>
					</div>
				{:else}
					<ResourceSelector
						list={championships.filter((championship) => championship.tag)}
						bind:selectedItem={selectedChampionshipID}
						name="championship-reign"
						maxHeight={350}
					/>
					<div class="w1 flex end">
						<button
							type="button"
							class="btn cta navigation-button"
							on:click={() => scrollToElement('.navigate-to-teams')}
						>
							<Icon icon="arrow-down" />
							Seleccionar equipo
						</button>
					</div>
				{/if}
			</Box>

			<Box icon="info-circle" title="Miembros" classes="navigate-to-teams">
				<TeamSingleSelector
					maxMembers={2}
					hasExtraFilters={true}
					list={selectedChampionship
						? wrestlers.filter((wrestler) => wrestler.gender === selectedChampionship.gender)
						: wrestlers}
				/>

				<div class="w1 flex end">
					<button
						type="button"
						class="btn cta navigation-button"
						on:click={() => scrollToElement('#common-reign-data')}
					>
						<Icon icon="arrow-down" />
						Datos comunes
					</button>
				</div>
			</Box>
		{/if}

		<UpsertCommonDatas {reign} {ppvs} {isUpdate} />
	</div>
</div>

<style>
	.championship-selected {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.championship-selected img {
		max-width: 200px;
	}
</style>
