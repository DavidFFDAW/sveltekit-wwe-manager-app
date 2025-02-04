<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import { tick } from 'svelte';

	type Team = {
		id: number;
		name: string;
		image: string | null;
		members: { id: number; name: string; image: string | null }[];
	};

	let search: string = '';
	export let selectedTeam: number = 0;
	export let teams: Team[] = [];
	let selectedTeamMembers: number[] = [];
	$: teamMembers = teams.find((team) => team.id === selectedTeam)?.members ?? [];
	$: filteredTeams = teams.filter(
		(team) =>
			team.members.some((member) => member.name.toLowerCase().includes(search.toLowerCase())) ||
			team.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleTeamMembersSelection = async (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLInputElement;
		const value = Number(target.value);

		if (target.checked) {
			console.log('esta checked');

			if (selectedTeamMembers.length >= 1) {
				console.log('Ya hay dos miembros seleccionados', selectedTeamMembers);
				selectedTeamMembers = selectedTeamMembers.slice(1);
			} else {
				console.log('Agregando miembro al equipo', selectedTeamMembers);
				selectedTeamMembers = [...selectedTeamMembers, value];
			}
		} else {
			console.log('no esta checked');

			console.log('Quitando miembro del equipo');
			selectedTeamMembers = selectedTeamMembers.filter((member) => member !== value);
		}

		await tick();
	};
</script>

<div class="w1 team-selector-container flex column astart gap-medium">
	<div class="w1 team-selector-with-search-container flex column astart gap-smaller">
		<input type="text" placeholder="Buscar equipo" bind:value={search} />

		<div class="w1 team-selector grid grid-two-column gap-smaller responsive">
			{#each filteredTeams as team}
				<div class="team-selector-item">
					<label class="relative" class:selected={selectedTeam === team.id}>
						<input
							type="radio"
							class="app-radio"
							name="selected-team"
							value={team.id}
							bind:group={selectedTeam}
							checked={selectedTeam === team.id}
							on:change={() => (selectedTeamMembers = [])}
						/>
						<div class="flex gap-smaller">
							<div class="images-container relative">
								<img src={team.members[0].image} alt={team.members[0].name} use:errorimage />
								<img src={team.members[1].image} alt={team.members[1].name} use:errorimage />
							</div>
							<span>{team.name}</span>
						</div>
					</label>
				</div>
			{/each}
		</div>
	</div>

	{#if teamMembers.length > 2}
		<div class="team-two-members-selection">
			<h4 class="w1 tcenter">Selecciona a los campeones</h4>
			<div class="w1 team-two-members-selection-wrapper down">
				{#each teamMembers as member}
					<label class="relative">
						<input
							type="checkbox"
							class="app-checkbox"
							name="selected-team-members"
							value={member.id}
							on:change={handleTeamMembersSelection}
							checked={selectedTeamMembers.includes(member.id)}
						/>
						<div class="inner">
							<img class="image" src={member.image} alt={member.name} use:errorimage />
							<span>{member.name}</span>
						</div>
					</label>
				{/each}
			</div>
		</div>
	{/if}

	{#if selectedTeamMembers.length > 0}
		{#each selectedTeamMembers as member}
			<p>{member}</p>
		{/each}

		<input type="hidden" name="team-members[]" bind:value={selectedTeamMembers} />
		<input type="hidden" name="team-wrestler-champion" bind:value={selectedTeamMembers[0]} />
		<input type="hidden" name="team-wrestler-partner" bind:value={selectedTeamMembers[1]} />
	{/if}
</div>

<style>
	.team-selector {
		overflow-x: hidden;
		overflow-y: auto;
		max-height: 300px;
	}
	.team-selector-item label {
		overflow: hidden;
		display: block;
		background-color: #eee;
		border-radius: 6px;
	}
	.team-selector-item label.selected {
		border: 2px solid var(--blue);
	}
	.images-container {
		position: relative;
		width: 40%;
		min-height: 100px;
	}
	.images-container img {
		width: 80px;
		height: 80px;
		position: absolute;
		bottom: 0;
	}

	.images-container img:first-child {
		left: 0;
		object-position: left;
		z-index: 1;
	}

	.images-container img:last-child {
		right: 0;
		object-position: right;
		z-index: 0;
	}

	.team-two-members-selection {
		width: 100%;
		overflow: hidden;
	}

	.team-two-members-selection-wrapper {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 10px;
	}

	.team-two-members-selection-wrapper label {
		height: 100%;
	}
	.team-two-members-selection-wrapper label .inner {
		width: 100%;
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
	}

	.team-two-members-selection-wrapper label .inner img {
		width: 100px;
		height: 100px;
		object-fit: cover;
		border-radius: 10px;
	}

	.team-two-members-selection-wrapper label .inner span {
		text-align: center;
		padding: 0 15px;
	}

	.team-two-members-selection-wrapper label input[type='checkbox']:checked + .inner {
		border: 2px solid var(--blue);
		color: var(--blue);
	}

	@media screen and (max-width: 768px) {
		.team-two-members-selection-wrapper {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-gap: 10px;
		}
	}
</style>
