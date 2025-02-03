<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import ResourceSelector from '$lib/components/forms/selector/resource-selector.svelte';
	import type { Championship, ChampionshipReign, Wrestler } from '@prisma/client';

	type Reign = ChampionshipReign & {
		Wrestler: Wrestler;
		Partner: Wrestler;
		Championship: Championship;
	};

	export let reign: Reign = {} as Reign;
	export let championships: {
		id: number;
		name: string;
		image: string;
		gender: string;
		tag: boolean;
	}[] = [];
	export let wrestlers: { id: number; name: string; image: string; gender: string }[] = [];
	export let teams: {
		id: number;
		name: string;
		image: string | null;
		members: { id: number; name: string; image: string | null }[];
	}[] = [];
	export let ppvs: string[] = [];

	let view: 'single' | 'team' | 'no-team' = 'single';
	let selectedChampionshipID = reign.championship_id;
	let selectedWrestlerID = reign.wrestler_id;
	let selectedTeamID = reign.team_id ?? 0;

	$: selectedChampionship = championships.find(
		(championship) => championship.id === selectedChampionshipID
	);
	$: selectedTeam = teams.find((team) => team.id === selectedTeamID);
	$: console.log(teams, selectedTeamID, selectedTeam);
</script>

<div class="w1 flex start acenter gap-5">
	<label class="relative btn">
		<input
			type="radio"
			class="app-radio"
			name="reign-type"
			value="single"
			bind:group={view}
			checked={view === 'single'}
		/>
		Individual
	</label>
	<label class="relative btn">
		<input
			type="radio"
			class="app-radio"
			name="reign-type"
			value="team"
			bind:group={view}
			checked={view === 'team'}
		/>
		Parejas
	</label>

	<label class="relative btn">
		<input
			type="radio"
			class="app-radio"
			name="reign-type"
			value="no-team"
			bind:group={view}
			checked={view === 'no-team'}
		/>
		Sin equipo
	</label>
</div>
<div class="championship-reign-upsert-component grid grid-two-column gap-medium responsive">
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
				list={wrestlers.filter((wrestler) => wrestler.gender === selectedChampionship?.gender)}
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

		<Box icon="info-circle" title="Luchador">
			<ResourceSelector list={teams} bind:selectedItem={selectedTeamID} name="wrestler-reign" />
		</Box>
	{/if}

	<div class="common-reign-data-container">
		<Box icon="info-circle" title="Datos comunes">
			<Input
				label="Fecha inicio"
				type="date"
				placeholder="Fecha de inicio"
				name="won_date"
				value={reign.won_date.toISOString().split('T')[0]}
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

<style>
	.common-reign-data-container {
		grid-column: span 2;
	}
</style>
