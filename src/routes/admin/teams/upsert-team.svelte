<script lang="ts">
	import type { Wrestler } from '@prisma/client';
	import type { UpsertTeam } from './upsert.models';
	import TeamSingleSelector from '$lib/components/forms/selector/team-single-selector.svelte';
	import Box from '$lib/components/box/box.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import BrandsSelector from '$lib/components/forms/inputs/brands-selector.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import { Utils } from '$lib/utils/general.utils';

	export let team: UpsertTeam = {} as UpsertTeam;
	export let wrestlers: Wrestler[];

	const isUpdate = Boolean(team.id);
	let teamName = team.name || '';
	$: slug = !isUpdate ? Utils.slugify(teamName) : team.slug || '';
</script>

<div class="w1 flex astart column gap-small">
	<Box title="Datos" icon="info-square">
		<div class="w1 grid two-column-grid gap-small responsive">
			<Input
				type="text"
				name="team-name"
				label="Nombre del equipo"
				placeholder="Nombre del equipo"
				bind:value={teamName}
				maxlength={255}
				required={true}
			/>
			<Input
				type="text"
				name="team-slug"
				label="Slug del equipo"
				placeholder="Slug del equipo"
				bind:value={slug}
				maxlength={255}
				required={true}
			/>
			<Input
				type="number"
				name="team-average"
				label="Promedio de equipo"
				placeholder="84"
				value={team.average}
				required={true}
				min={45}
				max={100}
			/>
			<ToggleInput name="team-active" label="Estado del equipo" checked={team.active} />
		</div>
		<div class="team-brand-selector">
			<BrandsSelector value={team.brand} />
		</div>
	</Box>

	<Box title="Miembros del equipo" icon="people-fill">
		<p class="text">Selecciona los luchadores que formarán parte del equipo</p>

		{#if team.members && team.members.length > 0}
			<TeamSingleSelector
				list={wrestlers.map((wrestler) => {
					return {
						id: wrestler.id,
						name: wrestler.name,
						image: wrestler.image_name as string,
						status: wrestler.status
					};
				})}
				maxMembers={5}
				selectedMembers={team.members.map((wrestler) => {
					return {
						id: wrestler.id,
						name: wrestler.name,
						image: wrestler.image_name as string,
						status: wrestler.status
					};
				})}
			/>
		{:else}
			<TeamSingleSelector
				list={wrestlers.map((wrestler) => {
					return {
						id: wrestler.id,
						name: wrestler.name,
						image: wrestler.image_name as string,
						status: wrestler.status
					};
				})}
				maxMembers={5}
			/>
		{/if}
	</Box>
</div>
