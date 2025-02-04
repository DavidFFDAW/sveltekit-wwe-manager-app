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

	export let reign: UpsertReign = {} as UpsertReign;
	export let championships: UpserReignChampionship[] = [];
	export let wrestlers: UpserReignWrestler[] = [];
	export let teams: UpsertReignTeams[] = [];
	export let ppvs: string[] = [];

	let view: 'single' | 'team' | 'no-team' = 'single';
	const isUpdate = Boolean(reign.id);

	let selectedChampionshipID = reign.championship_id;
	let selectedWrestlerID = reign.wrestler_id;
	let selectedTeamMembers = reign.partner ? [reign.Wrestler, reign.Partner] : [];
	if (reign.team_id && reign.Championship.tag) {
		view = 'team';
	}
	if (!reign.team_id && reign.Championship.tag) {
		view = 'no-team';
	}

	$: selectedChampionship = championships.find(
		(championship) => championship.id === selectedChampionshipID
	);
</script>

<div class="w1 flex column astart gap">
	<ViewButtons bind:view />

	<div class="w1 championship-reign-upsert-component grid grid-two-column gap-medium responsive">
		<!-- abstract page parts into components, please -->
		{#if view === 'single'}
			<Box icon="info-circle" title="Título">
				<ResourceSelector
					list={championships.filter((championship) => !championship.tag)}
					bind:selectedItem={selectedChampionshipID}
					name="championship-reign"
				/>
			</Box>

			<Box icon="info-circle" title="Luchador">
				<ResourceSelector
					list={selectedChampionship
						? wrestlers.filter((wrestler) => wrestler.gender === selectedChampionship?.gender)
						: wrestlers}
					bind:selectedItem={selectedWrestlerID}
					name="wrestler-reign"
				/>
			</Box>
		{/if}

		{#if view === 'team'}
			<Box icon="info-circle" title="Título">
				<ResourceSelector
					list={championships.filter((championship) => championship.tag)}
					bind:selectedItem={selectedChampionshipID}
					name="championship-reign"
				/>
			</Box>

			<Box icon="info-circle" title="Equipo">
				<TeamSelection {teams} selectedTeam={reign.team_id ? reign.team_id : 0} />
			</Box>

			{#if selectedTeamMembers.length > 0}
				<Box icon="info-circle" title="Miembros del equipo">
					{#each selectedTeamMembers as member}
						<p>{member.name}</p>
					{/each}
				</Box>
			{/if}
		{/if}

		<div class="common-reign-data-container grid-span-column">
			<Box icon="info-circle" title="Datos comunes">
				<Input
					label="Fecha inicio"
					type="date"
					placeholder="Fecha de inicio"
					name="won_date"
					value={reign.won_date?.toISOString().split('T')[0]}
				/>
				<Input
					label="Fecha fin"
					type="date"
					placeholder="Fecha de fin"
					name="lost_date"
					value={reign.lost_date?.toISOString().split('T')[0] ?? ''}
				/>
				<Input
					label="Días"
					name="days"
					type="number"
					placeholder="Días de reinado"
					bind:value={reign.days}
				/>

				<Input
					label="Evento"
					name="show_won"
					type="text"
					placeholder="Evento en el que se ganó"
					bind:value={reign.ppv_won as string}
					options={['RAW', 'Smackdown', 'AWL', 'Saturday Night Main Event', ...ppvs]}
				/>
				<Input
					label="Forma de victoria"
					name="victory_way"
					type="text"
					placeholder="Forma de victoria"
					bind:value={reign.victory_way as string}
					options={['Pinfall', 'Submission', 'Countout', 'Disqualification', 'Cash-in', 'Otro']}
				/>
			</Box>
		</div>
	</div>
</div>

<style>
	.grid-span-column {
		grid-column: span 2;
	}

	@media screen and (max-width: 768px) {
		.grid-span-column {
			grid-column: span 1;
		}
	}
</style>
