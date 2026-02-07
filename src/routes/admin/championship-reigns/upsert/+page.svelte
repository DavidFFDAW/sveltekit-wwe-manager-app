<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import { onMount } from 'svelte';
	import StepChampionship from './steps/step-championship.svelte';
	import StepWrestlers from './steps/step-wrestlers.svelte';
	import DateInput from '$lib/components/forms/date/date-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import './page.css';

	let { data } = $props();
	let currentStep = $state(0);
	let selectedChampionshipId = $state(data.reign?.championship_id || null);
	let selectedChampionship = $derived(data.championshipsMap.get(selectedChampionshipId || 0));
	let isTagTeam = $derived(selectedChampionship?.tag || false);
	let selectedWrestlerId = $state(data.reign?.wrestler_id || null);
	let selectedTeamId = $state(data.reign?.team_id || null);
	let selectedTeam = $derived(
		data.finalParsedTeams.find((team) => team.id === selectedTeamId) || null
	);
	let maxSteps = $derived(isTagTeam ? 4 : 3);

	$inspect({
		selectedChampionshipId,
		selectedChampionship,
		selectedWrestlerId,
		selectedTeamId,
		selectedTeam,
		isTagTeam,
		finalParsedTeams: data.finalParsedTeams,
		members: selectedTeam?.members || []
	});

	onMount(() => {
		setTimeout(() => {
			if (data.isUpdate) {
				currentStep = maxSteps - 1;
			}
		}, 1000);
	});
</script>

<div class="reigns-upsert-page" style="--total-steps: {maxSteps}; --current-step: {currentStep}">
	<AsyncForm
		action="upsert"
		method="post"
		redirect="/admin/championship-reigns"
		buttonText={data.isUpdate ? 'Actualizar Reinado' : 'Crear Reinado'}
		updateId={data.reign ? data.reign.id : ''}
		showButtons={false}
	>
		<div class="steps-container">
			<input
				type="hidden"
				name="tag_type"
				value={selectedChampionship?.tag ? 'team' : 'individual'}
			/>
			<div class="step" data-step-number="1" data-step="championship">
				<StepChampionship list={data.championships} bind:currentStep bind:selectedChampionshipId />
			</div>

			<div class="step" data-step-number="2" data-step="wrestlers|teams">
				{#if selectedChampionship && !selectedChampionship.tag}
					<StepWrestlers list={data.wrestlers} bind:currentStep bind:selectedWrestlerId />
				{:else}
					<div class="step-teams">
						<header class="step-header">
							<h2 class="step-title">Elige un equipo</h2>
						</header>

						<div class="step-inner">
							<ul class="list">
								{#each data.finalParsedTeams as team}
									<li class="list-item">
										<label class="list-item-label relative">
											<input
												type="radio"
												class="app-radio"
												name="team_id"
												value={team.id}
												bind:group={selectedTeamId}
											/>
											<di class="inner">
												{team.name} <small>({team.members.length})</small>
											</di>
										</label>
									</li>
								{/each}
							</ul>
						</div>

						<div class="buttons">
							<button type="button" class="btn secondary" onclick={() => currentStep--}>
								Atras
							</button>
							<button
								type="button"
								class="btn cta"
								onclick={() => currentStep++}
								disabled={!selectedTeamId}
							>
								Siguiente
							</button>
						</div>
					</div>
				{/if}
			</div>

			{#if isTagTeam && selectedTeam?.members.length > 2}
				<div class="step" data-step-number="3" data-step="reign-datas">
					<header class="step-header">
						<h2 class="step-title">Elige los miembros del equipo</h2>
					</header>
				</div>
			{/if}

			<div class="step" data-step-number={data.reign?.team_id ? 4 : 3} data-step="reign-datas">
				<header class="step-header">
					<h2 class="step-title">Datos</h2>
				</header>

				<div class="step-inner">
					<DateInput
						label="Fecha de inicio"
						name="start_date"
						value={data.reign?.won_date.toString().substring(0, 10) || ''}
						required={true}
					/>
					<DateInput
						label="Fecha de finalización"
						name="end_date"
						value={data.reign?.lost_date?.toString().substring(0, 10) || ''}
						required={false}
					/>

					<Input
						type="number"
						label="Días"
						name="days"
						value={data.reign?.days || ''}
						placeholder="Días que duró el reinado"
						required={false}
					/>

					<Input
						type="text"
						label="Evento donde ganó el campeonato"
						name="won_event"
						value={data.reign?.ppv_won || ''}
						placeholder="Evento donde ganó el campeonato"
						required={false}
					/>

					<Input
						type="text"
						label="Forma en que se ganó el campeonato"
						name="victory_way"
						value={data.reign?.victory_way || ''}
						placeholder="Forma en que se ganó el campeonato"
						required={false}
					/>
				</div>

				<div class="buttons">
					<button type="button" class="btn secondary" onclick={() => currentStep--}>Atras</button>
					<button type="submit" class="btn cta">
						{data.isUpdate ? 'Actualizar Reinado' : 'Crear Reinado'}
					</button>
				</div>
			</div>
		</div>
	</AsyncForm>
</div>
