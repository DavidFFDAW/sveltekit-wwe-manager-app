<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import type { UpsertReignTeams } from '../interfaces/reigns.interfaces';

	type Team = {
		id: number;
		name: string;
		image: string | null;
		members: { id: number; name: string; image: string | null }[];
	};

	let search: string = '';
	export let name: string;
	export let teams: Team[] = [];
	export let selectedTeam: number = 0;
	export let selectedTeamMembers: number[] = [];
	let teamMembers: UpsertReignTeams['members'] = [];

	$: teamMembers = teams.find((team) => team.id === selectedTeam)?.members ?? [];
	$: filteredTeams = teams.filter(
		(team) =>
			team.members.some((member) => member.name.toLowerCase().includes(search.toLowerCase())) ||
			team.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleTeamMembersSelection = (memberId: number) => () => {
		if (!memberId) return;

		if (selectedTeamMembers.includes(memberId)) {
			selectedTeamMembers = selectedTeamMembers.filter((id) => id !== memberId);
			return;
		}
		if (selectedTeamMembers.length >= 2) {
			selectedTeamMembers = [...selectedTeamMembers.slice(1), memberId];
			return;
		} else {
			selectedTeamMembers = [...selectedTeamMembers, memberId];
		}
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
							name="{name}-selected-team"
							value={team.id}
							bind:group={selectedTeam}
							checked={selectedTeam === team.id}
							on:change={() => (selectedTeamMembers = team.members.map((member) => member.id))}
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
					<div
						role="presentation"
						class="app-button flex gap-smaller"
						on:click={handleTeamMembersSelection(member.id)}
						class:selected={selectedTeamMembers.includes(member.id)}
					>
						<img class="image" src={member.image} alt={member.name} use:errorimage />
						<span>{member.name}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if teamMembers.length > 0}
		{#each selectedTeamMembers as member}
			<input type="hidden" name="{name}-team-members[]" bind:value={member} />
		{/each}

		<input type="hidden" name="{name}-team-id" bind:value={selectedTeam} />
		<input type="hidden" name="{name}-team-wrestler-champion" bind:value={selectedTeamMembers[0]} />
		<input type="hidden" name="{name}-team-wrestler-partner" bind:value={selectedTeamMembers[1]} />
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

	.team-two-members-selection-wrapper .app-button {
		display: flex;
		padding: 10px;
		border-radius: 6px;
		background-color: #eee;
		overflow: hidden;
		cursor: pointer;
	}

	.team-two-members-selection-wrapper .app-button img.image {
		width: 45px;
		height: auto;
		object-fit: cover;
		border-radius: 6px;
	}

	.team-two-members-selection-wrapper .app-button.selected {
		border: 2px solid var(--blue);
	}

	@media screen and (max-width: 960px) {
		.team-two-members-selection-wrapper {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-gap: 10px;
		}
	}
	@media screen and (max-width: 768px) {
		.team-two-members-selection-wrapper {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-gap: 10px;
		}
	}
</style>
