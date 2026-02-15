<script lang="ts">
	import { onMount } from 'svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import StepWrestlers from './steps/step-wrestlers.svelte';
	import DateInput from '$lib/components/forms/date/date-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import { errorimage } from '$lib/actions/error.image';
	import MembersSelector from './members-selector.svelte';
	import './page.css';

	let { data } = $props();
	let currentStep = $state(1);
	let currentTagType = $state<'team' | 'manual'>(data.currentTagType || 'team');
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
	let lastStep = $derived(
		isTagTeam && (currentTagType === 'manual' || selectedTeam?.members.length > 2) ? 4 : 3
	);
	let members = $state(data.members || []);
	let realMembers = $derived.by(() => {
		if (currentTagType === 'manual')
			return members.map((memberId: any) => data.wrestlersMap.get(memberId)).filter(Boolean);
		if (members.length <= 2 && selectedTeam?.members.length === 2)
			return selectedTeam?.members || [];
		return selectedTeam?.members.filter((member: any) => members.includes(member.id)) || [];
	});

	// let disabledNextStep = $derived.by(() => {
	// 	if (currentStep === 1) return !selectedChampionshipId;
	// 	if (currentStep === 2) {
	// 		if (isTagTeam) {
	// 			return !(selectedTeamId || currentTagType === 'manual');
	// 		} else {
	// 			return !selectedWrestlerId;
	// 		}
	// 	}
	// 	if (currentStep === 3 && isTagTeam) {
	// 		if (currentTagType === 'manual') {
	// 			return members.length !== 2;
	// 		} else {
	// 			return !selectedTeamId || (selectedTeam?.members.length > 2 && members.length !== 2);
	// 		}
	// 	}
	// 	return false;
	// });

	$effect(() => {
		if (members.length > 2) members = members.slice(0, 2);
	});
	$effect(() => {
		if (currentStep === 2 && isTagTeam) {
			currentTagType = 'team';
		}
	});

	const nextStep = () => {
		if (currentStep < maxSteps) {
			const next = currentStep + 1;
			const state = { ...(history.state ?? {}), step: next };
			history.pushState(state, '', location.href);
			currentStep++;
		}
	};

	const previousStep = () => {
		if (currentStep > 1) {
			const prev = currentStep - 1;
			const state = { ...(history.state ?? {}), step: prev };
			history.pushState(state, '', location.href);
			currentStep--;
		}
	};

	function handlePopState(e: PopStateEvent) {
		e.preventDefault();
		const s = e.state?.step ?? 1;
		if (s >= 1 && s <= maxSteps) {
			currentStep = s;
		}
	}

	const handleTeamSelection = (type: 'manual' | 'team') => (event: Event) => {
		currentTagType = type;
		if (type === 'manual') nextStep();
	};

	onMount(() => {
		setTimeout(() => {
			if (data.isUpdate) {
				currentStep = maxSteps - 1;
			}
		}, 500);

		const initial = history.state?.step ?? 1;
		currentStep = initial;
		history.replaceState({ ...(history.state ?? {}), step: initial }, '', location.href);
		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
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
				value={selectedChampionship?.tag ? 'tag_team' : 'individual'}
			/>
			<input
				type="hidden"
				name="team_original_members_length"
				value={selectedTeam?.members.length || 0}
			/>

			<div
				class="step"
				data-step-number="1"
				data-step="championship"
				class:active={currentStep === 1}
			>
				<div class="step-teams">
					<header class="step-header">
						<h2 class="step-title">Elige un campeonato</h2>
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
											{#if chp.tag}
												<span class="badge chp-tag-badge">Tag Team</span>
											{/if}
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
							<button
								type="button"
								class="w1 btn info block btn-manual-team-selection"
								onclick={handleTeamSelection('manual')}
							>
								¿No encuentras el equipo? Elige a los luchadores manualmente
							</button>

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
												disabled={currentTagType === 'manual'}
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

			{#if isTagTeam && currentTagType === 'manual'}
				<div
					class="step"
					data-step-number="3"
					data-step="team-members-manual"
					class:active={currentStep === 3}
				>
					<header class="step-header">
						<h2 class="step-title">Elige los campeones</h2>
					</header>

					<div class="step-inner">
						<MembersSelector
							list={data.wrestlers}
							map={data.wrestlersMap}
							name="manual_member_ids"
							bind:selected={members}
						/>
					</div>

					<div class="buttons">
						<button type="button" class="btn secondary" onclick={previousStep}> Atras </button>
						<button
							type="button"
							class="btn cta"
							onclick={nextStep}
							disabled={!members || members.length < 2}
						>
							Siguiente
						</button>
					</div>
				</div>
			{/if}

			{#if isTagTeam && currentTagType === 'team' && selectedTeam?.members.length > 2}
				<div
					class="step"
					data-step-number="3"
					data-step="team-members"
					class:active={currentStep === 3}
				>
					<header class="step-header">
						<h2 class="step-title">Elige los miembros</h2>
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
				data-step="reign-datas"
				data-step-number={lastStep}
				class:active={currentStep === lastStep}
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

						{#if !isTagTeam && selectedWrestler}
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

						{#if isTagTeam && realMembers.length > 0}
							<div class="team-card single-card flow-{currentTagType}">
								<div class="resume-team-members-container">
									{#each realMembers as member}
										<img
											width="40"
											data-member-id={member.id}
											src={member.image_name}
											alt={member.name}
											class="team-member-image"
											use:errorimage={'/vacant.webp'}
										/>
									{/each}
								</div>
								<div class="team-info">
									{#if currentTagType === 'team' && selectedTeam}
										<p>{selectedTeam.name}</p>
									{:else}
										<p>{realMembers.map((member: any) => member.name).join(' & ')}</p>
									{/if}
								</div>
							</div>
						{/if}
					</div>

					<DateInput
						label="Fecha de inicio"
						name="start_date"
						value={data.reign?.won_date.toString().substring(0, 10) ||
							new Date().toISOString().substring(0, 10)}
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

					{#each realMembers as member}
						<input type="hidden" name="member_ids[]" value={member.id} />
					{/each}
					<input type="hidden" name="current_tag_type" value={currentTagType} />
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
		position: relative;
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
		cursor: pointer;
	}

	.championship-card .badge.chp-tag-badge {
		position: absolute;
		top: 5px;
		right: 5px;
		background-color: #333;
		color: #fff;
		font-size: 0.6rem;
		padding: 2px 6px;
		border-radius: 4px;
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
		min-height: 80px;
	}
	.resume .single-card img {
		padding: 4px;
		border-radius: 8px;
		background-color: #eee;
		border: 1px solid #ddd;
	}
	.resume .single-card .resume-team-members-container {
		position: relative;
		width: 135px;
		height: 80px;
		overflow: hidden;
		overflow-x: auto;
		background-color: #eee;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.resume .single-card .resume-team-members-container img.team-member-image {
		position: absolute;
		background-color: transparent;
		border: none;
		bottom: 0;
		left: 0;
		width: 80px;
		height: 100%;
		object-fit: cover;
		object-position: left;
		z-index: 1;
	}
	.resume .single-card .resume-team-members-container img.team-member-image:last-child {
		left: 50px;
		object-position: right;
	}

	.btn-manual-team-selection {
		margin-bottom: 15px;
	}
</style>
