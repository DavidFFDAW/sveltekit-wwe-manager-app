<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import { onMount } from 'svelte';
	import StepWrestlers from './steps/step-wrestlers.svelte';
	import DateInput from '$lib/components/forms/date/date-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import './page.css';
	import { errorimage } from '$lib/actions/error.image';

	let { data } = $props();
	let currentStep = $state(1);
	let selectedChampionshipId = $state(data.reign?.championship_id || null);
	let selectedChampionship = $derived(data.championshipsMap.get(selectedChampionshipId || 0));
	let isTagTeam = $derived(selectedChampionship?.tag || false);
	let selectedWrestlerId = $state(data.reign?.wrestler_id || null);
	let selectedWrestler = $derived(data.wrestlersMap.get(selectedWrestlerId || 0));
	let selectedTeamId = $state(data.reign?.team_id || null);
	let selectedTeam = $derived(
		data.finalParsedTeams.find((team) => team.id === selectedTeamId) || null
	);
	let maxSteps = $derived(isTagTeam ? 4 : 3);
	let members = $state([]);
	let realMembers = $derived(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		selectedTeam?.members.filter((member: any) => members.includes(member.id)) || []
	);

	$effect(() => {
		if (members.length > 2) members = members.slice(0, 2);
	});

	const nextStep = () => {
		if (currentStep < maxSteps) {
			currentStep++;
		}
	};

	const previousStep = () => {
		if (currentStep > 1) {
			currentStep--;
		}
	};

	onMount(() => {
		setTimeout(() => {
			if (data.isUpdate) {
				currentStep = maxSteps - 1;
			}
		}, 500);
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
			<div
				class="step"
				data-step-number="1"
				data-step="championship"
				class:active={currentStep === 1}
			>
				<div class="step-teams">
					<header class="step-header">
						<h2 class="step-title">Elige un equipo</h2>
					</header>

					<div class="step-inner">
						<ul class="list">
							{#each data.championships as chp}
								<li class="list-item">
									<label class="list-item-label relative">
										<input
											type="radio"
											class="app-radio"
											name="championship_id"
											value={chp.id}
											bind:group={selectedChampionshipId}
											onchange={nextStep}
										/>
										<div class="inner championship-card">
											<img
												width="50"
												src={chp.image}
												alt={chp.name}
												class="championship-image"
												use:errorimage={'/unknown-championship.webp'}
											/>
											<p>{chp.name}</p>
										</div>
									</label>
								</li>
							{/each}
						</ul>
					</div>

					<div class="buttons">
						<button type="button" class="btn secondary" onclick={previousStep}>Atras</button>
						<button
							type="button"
							class="btn cta"
							onclick={nextStep}
							disabled={!selectedChampionshipId}
						>
							Siguiente
						</button>
					</div>
				</div>
			</div>

			<div
				class="step"
				data-step-number="2"
				data-step="wrestlers|teams"
				class:active={currentStep === 2}
			>
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
												onchange={nextStep}
											/>
											<div class="inner team-members-card">
												<!-- <div class="team-members-container">
													{#each team.members as member}
														<div class="single-team-member">
															<img
																width="40"
																src={member.image_name}
																alt={member.name}
																class="team-member-image"
																use:errorimage={'/vacant.webp'}
															/>
															<p>{member.name}</p>
														</div>
													{/each}
												</div> -->
												<div class="w1 team-info">
													<p>{team.name} <small>({team.members.length})</small></p>
													<small class="team-members">
														({team.members.map((member: any) => member.name).join(',  ')})
													</small>
												</div>
											</div>
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
				<div
					class="step"
					data-step-number="3"
					data-step="team-members"
					class:active={currentStep === 3}
				>
					<header class="step-header">
						<h2 class="step-title">Elige los miembros del equipo</h2>
					</header>

					<div class="step-inner">
						<ul class="list">
							{#each selectedTeam.members as member}
								<li class="list-item team-wrestler-member">
									<label class="list-item-label relative">
										<input
											type="checkbox"
											class="app-checkbox"
											name="member_ids"
											value={member.id}
											bind:group={members}
											max="2"
										/>
										<div
											class="inner team-wrestler-member-inner set-brand-color-{member.brand.toLowerCase()}"
										>
											<div class="team-wrestler-member-image-container">
												<img
													width="80"
													src={member.image_name}
													alt={member.name}
													class="team-wrestler-member-avatar"
													use:errorimage={'/vacant.webp'}
												/>
											</div>
											<div class="team-wrestler-member-info">
												<p class="team-wrestler-member-title">{member.name}</p>
											</div>
										</div>
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
							disabled={!members || members.length < 2}
						>
							Siguiente
						</button>
					</div>
				</div>
			{/if}

			<div
				class="step"
				data-step-number={isTagTeam && selectedTeam?.members.length > 2 ? 4 : 3}
				data-step="reign-datas"
				class:active={currentStep === (isTagTeam && selectedTeam?.members.length > 2 ? 4 : 3)}
			>
				<header class="step-header">
					<h2 class="step-title">Datos</h2>
				</header>

				<div class="step-inner step-reign-datas">
					<div class="w1 resume">
						{#if selectedChampionship}
							<div class="championship-card single-card">
								<img
									src={selectedChampionship.image}
									alt={selectedChampionship.name}
									width="50"
									use:errorimage={'/unknown-championship.webp'}
								/>
								<p>{selectedChampionship.name}</p>
							</div>
						{/if}

						{#if selectedWrestler}
							<div class="championship-card single-card">
								<img
									src={selectedWrestler.image_name}
									alt={selectedWrestler.name}
									width="50"
									use:errorimage={'/vacant.webp'}
								/>
								<p>{selectedWrestler.name}</p>
							</div>
						{/if}

						{#if selectedTeam}
							<div class="team-card single-card">
								<div class="team-members-container">
									{#each realMembers as member}
										<img
											width="40"
											src={member.image_name}
											alt={member.name}
											class="team-member-image"
											use:errorimage={'/vacant.webp'}
										/>
									{/each}
								</div>
								<div class="team-info">
									<p>{selectedTeam.name}</p>
								</div>
							</div>
						{/if}
					</div>

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
						type="text"
						label="Evento donde ganó el campeonato"
						name="won_event"
						value={data.reign?.ppv_won || ''}
						placeholder="Evento donde ganó el campeonato"
						required={false}
						options={data.ppvs}
					/>

					<Input
						type="text"
						label="Forma en que se ganó el campeonato"
						name="victory_way"
						value={data.reign?.victory_way || ''}
						placeholder="Forma en que se ganó el campeonato"
						required={false}
						options={['Pinfall', 'Submission', 'Countout', 'Disqualification', 'Cash-in', 'Otro']}
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

<style>
	[data-step='championship'] ul.list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		align-items: stretch;
		gap: 5px;
	}
	[data-step='championship'] ul.list li.list-item .championship-card {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 8px;
		border: 2px solid #ddd;
	}
	[data-step='championship'] ul.list li.list-item .championship-card p {
		text-align: center;
		font-weight: 600;
	}

	.steps-container .step label input.app-radio + .team-members-card {
		width: 100%;
		/* display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center; */
		/* gap: 10px; */
		padding: 5px;
		/* border: 2px solid #ddd; */
	}
	/* .steps-container .step label input.app-radio + .team-members-card div.team-members-container {
		width: 100%;
		display: flex;
		padding: 6px 5px;
		overflow-x: auto;
		overflow-y: hidden;
		border-bottom: 2px solid #ddd;
		gap: 10px;
	}
	.steps-container
		.step
		label
		input.app-radio
		+ .team-members-card
		div.team-members-container
		.single-team-member {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		min-width: 80px;
	}
	.steps-container
		.step
		label
		input.app-radio
		+ .team-members-card
		div.team-members-container
		.single-team-member
		p {
		font-size: 0.6rem;
		text-align: center;
	} */

	.team-info {
		display: flex;
		padding: 10px;
		text-align: center;
		flex-direction: column;
		gap: 2px;
	}
	.team-info small.team-members {
		font-size: 0.7rem;
		color: #555;
		font-weight: 500;
	}

	.inner.team-wrestler-member-inner {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 5px;
		border-radius: 8px;
		border: 2px solid #ddd;
	}
	.inner.team-wrestler-member-inner div.team-wrestler-member-image-container {
		width: 100px;
		height: 80px;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
		background-color: #eee;
	}
	.inner.team-wrestler-member-inner div.team-wrestler-member-image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: relative;
		object-position: center;
		z-index: 1;
	}
	.inner.team-wrestler-member-inner div.team-wrestler-member-image-container::after {
		content: '';
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background-color: var(--brand-color);
		clip-path: polygon(100% 0, 0 100%, 100% 100%);
		opacity: 0.2;
		z-index: 0;
		pointer-events: none;
	}

	.inner.team-wrestler-member-inner .team-wrestler-member-info {
		width: 100%;
	}

	.step .step-inner.step-reign-datas {
		display: flex;
		flex-direction: column;
		gap: 25px;
	}

	.resume {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		align-items: center;
		gap: 10px;
	}
	.resume .single-card {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 8px;
		border-radius: 8px;
		border: 2px solid #ddd;
	}
	.resume .single-card img {
		padding: 4px;
		border-radius: 8px;
		background-color: #eee;
		border: 1px solid #ddd;
	}
	.resume .single-card .team-members-container {
		width: 100%;
		position: relative;
		max-width: 100px;
	}
	.resume .single-card .team-members-container img.team-member-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: relative;
		object-position: center;
		z-index: 1;
	}
</style>
