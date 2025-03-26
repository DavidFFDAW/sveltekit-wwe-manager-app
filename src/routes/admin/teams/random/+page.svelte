<script lang="ts">
	import { page } from '$app/state';
	import { errorimage } from '$lib/actions/error.image';
	import Box from '$lib/components/box/box.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import BrandsSelector from '$lib/components/forms/inputs/brands-selector.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import { Utils } from '$lib/utils/general.utils.js';

	const paussibleMembers = Array.from({ length: 5 - 1 }, (_, i) => ({
		value: (i + 2).toString(),
		label: (i + 2).toString()
	}));
	const possibleGenders = [
		{
			value: '',
			label: 'Ambos'
		},
		{
			value: 'M',
			label: 'Masculino'
		},
		{
			value: 'F',
			label: 'Femenino'
		}
	];
	export let data;
	let selectedGender: string = page.url.searchParams.get('members_gender') || '';
	let selectedMembers: string = page.url.searchParams.get('how_many_members') || '';
	let teamName: string = '';
	$: slug = Utils.slugify(teamName);
</script>

<PageWrapper page="admin-teams-create-random">
	<div class="title">
		<h1>Equipo aleatorio</h1>
		<small>Esta página es para crear un equipo aleatorio</small>
	</div>

	<form action="" method="get">
		<Box icon="dice-5-fill" title="Datos">
			<div class="w1 flex column astart gap-20 responsive">
				<RadioList
					label="Miembros"
					name="how_many_members"
					options={paussibleMembers}
					bind:value={selectedMembers}
				/>
				<RadioList
					label="Genero de los luchadores"
					name="members_gender"
					options={possibleGenders}
					bind:value={selectedGender}
				/>
			</div>

			<div class="w1 flex end">
				<button type="submit" class="btn cta">Generar equipo aleatorio</button>
			</div>
		</Box>
	</form>

	{#if data.wrestlers && data.wrestlers.length > 0}
		<AsyncForm
			action="createRandomTeam"
			method="post"
			redirect="/admin/teams?search={encodeURI(teamName)}"
			buttonText="Crear equipo"
		>
			<Box title="Equipo" icon="collection">
				<div class="wrestler-team-members-overview">
					{#each data.wrestlers as wrestler}
						<div class="wrestler-team-member">
							<div class="wrestler-team-member-image">
								<img
									use:errorimage={'/vacant.webp'}
									src={wrestler.image_name}
									alt={wrestler.name}
								/>
								<input type="hidden" name="wrestlers[]" value={wrestler.id} />
							</div>
							<div class="wrestler-team-member-name">{wrestler.name}</div>
						</div>
					{/each}
				</div>

				<div class="inner-datas">
					<Input type="text" label="Nombre" name="team_name" bind:value={teamName} required />
					<BrandsSelector />

					<div class="w1 flex gap-small">
						<div class="w1 flex-1">
							<Input type="slug" label="Slug" name="team_slug" bind:value={slug} required />
						</div>
						<ToggleInput label="Activo" name="team_status" checked={true} />
					</div>
				</div>
			</Box>
		</AsyncForm>
	{/if}
</PageWrapper>

<style>
	.wrestler-team-members-overview {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 20px;
		padding: 10px;
		border-radius: 5px;
		border: 1px solid #ccc;
	}
</style>
