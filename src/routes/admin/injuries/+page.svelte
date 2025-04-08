<script lang="ts">
	import Dialog from '$lib/components/dialog/dialog.svelte';
	import RangeDateInput from '$lib/components/forms/date/range-date-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import WrestlersSelector from '$lib/components/forms/selector/specific/wrestlers-selector.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import { fade } from 'svelte/transition';
	import { Utils } from '$lib/utils/general.utils';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ActionsAsync from '$lib/components/buttons/grouped-actions/actions-async.svelte';
	import CustomAction from '$lib/components/buttons/grouped-actions/custom-action.svelte';
	import type { Injuries } from '@prisma/client';
	import ResponsiveTable from '$lib/components/visual/responsive-table.svelte';
	import TableRow from '$lib/components/visual/table-row.svelte';

	export let data;
	let injuryData = {
		id: 0,
		injury: '',
		startDate: '',
		endDate: '',
		wrestlerId: 0,
		severity: ''
	};
	let showUpsertDialog: boolean = false;

	const selectEditInjury = (injury: Injuries) => {
		injuryData = {
			id: injury.id,
			injury: injury.injury,
			startDate: injury.start_date ? Utils.formatFlatpickrDate(injury.start_date) : '',
			endDate: Utils.formatFlatpickrDate(injury.end_date),
			wrestlerId: injury.wrestler_id,
			severity: injury.severity
		};
		showUpsertDialog = true;
	};
	$: formAction = injuryData.id ? 'updateInjury' : 'createInjury';
</script>

<PageWrapper page="admin-injuries-page">
	<h1>Injuries</h1>
	{#if data.injuries.length === 0}
		<p class="w1">No hay lesiones registradas</p>
	{:else}
		<ResponsiveTable header={['Wrestler', 'Lesión', 'Inicio', 'Fin', 'Acciones']}>
			{#each data.injuries as injury}
				<tr in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
					<TableRow label="Wrestler">{injury.Wrestler.name}</TableRow>
					<TableRow label="Lesión">{injury.injury}</TableRow>
					<TableRow label="Inicio">
						{injury.start_date === null ? 'N/A' : Utils.getDateLocale(injury.start_date)}
					</TableRow>
					<TableRow label="Fin">{Utils.getDateLocale(injury.end_date)}</TableRow>
					<TableRow label="Acciones" actions={true}>
						<CustomAction
							icon="pencil"
							color="info"
							click={() => selectEditInjury(injury)}
							text="Editar"
						/>
						<ActionsAsync
							method="delete"
							href={`/admin/injuries/${injury.id}`}
							color="danger"
							icon="trash"
							confirmate="¿Estás seguro de que quieres eliminar esta lesión?"
						>
							Eliminar
						</ActionsAsync>
					</TableRow>
				</tr>
			{/each}
		</ResponsiveTable>
	{/if}

	<div class="w1 flex end gap-small">
		<button type="button" class="btn btn-dark" on:click={() => (showUpsertDialog = true)}>
			Crear lesión
		</button>
	</div>

	<Dialog bind:opened={showUpsertDialog}>
		<AsyncForm
			showButtons={false}
			method="post"
			action={formAction}
			afterSubmit={() => (showUpsertDialog = false)}
			updateId={injuryData.id}
		>
			<div class="w1 flex between astart gap-small responsive">
				<WrestlersSelector
					list={data.wrestlers}
					name="injured-wrestler"
					bind:selectedItem={injuryData.wrestlerId}
					maxHeight={300}
					itemWidth={300}
				/>
				<div class="w1 flex column gap-small">
					<Input
						type="text"
						name="injury-name"
						label="Nombre de la lesión"
						placeholder="Nombre de la lesión"
						required={true}
						bind:value={injuryData.injury}
					/>
					<Input
						type="text"
						name="injury-severity"
						label="Severidad de la lesión"
						placeholder="Severidad de la lesión"
						bind:value={injuryData.severity}
						required={true}
					/>
					<div class="w1 flex-1 flex gap-small astart responsive">
						{#if showUpsertDialog}
							<RangeDateInput
								name="injury-dates"
								label="Inicio"
								required={false}
								bind:startDate={injuryData.startDate}
								bind:endDate={injuryData.endDate}
							/>
						{/if}
						<!-- <DateInput
							name="end-date"
							label="Finalización"
							required={true}
							bind:value={injuryData.endDate}
							bind:min={injuryData.startDate}
						/> -->
					</div>
				</div>
			</div>

			<div class="w1 flex end gap-small down">
				<button type="button" class="btn btn-dark" on:click={() => (showUpsertDialog = false)}>
					Cancelar
				</button>
				<button type="submit" class="btn btn-dark">
					{injuryData.id ? 'Actualizar lesión' : 'Crear lesión'}
				</button>
			</div>
		</AsyncForm>
	</Dialog>
</PageWrapper>
