<script lang="ts">
	import Dialog from '$lib/components/dialog/dialog.svelte';
	import RangeDateInput from '$lib/components/forms/date/range-date-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import WrestlersSelector from '$lib/components/forms/selector/specific/wrestlers-selector.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import { fade } from 'svelte/transition';
	import ResponsiveTable from './responsive-table.svelte';
	import { Utils } from '$lib/utils/general.utils';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import ActionsLink from '$lib/components/buttons/grouped-actions/actions-link.svelte';

	export let data;
	let injuryData = {
		injury: '',
		startDate: '',
		endDate: '',
		wrestlerId: 0,
		severity: ''
	};
	let showUpsertDialog: boolean = false;
</script>

<PageWrapper page="admin-injuries-page">
	<h1>Injuries</h1>
	{#if data.injuries.length === 0}
		<p class="w1">No hay lesiones registradas</p>
	{:else}
		<ResponsiveTable header={['Wrestler', 'Lesión', 'Inicio', 'Fin', 'Acciones']}>
			{#each data.injuries as injury}
				<tr in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
					<td data-label="Wrestler">{injury.Wrestler.name}</td>
					<td data-label="Lesión">{injury.injury}</td>
					<td data-label="Inicio">
						{injury.start_date === null ? 'N/A' : Utils.getDateLocale(injury.start_date)}
					</td>
					<td data-label="Fin">{Utils.getDateLocale(injury.end_date)}</td>
					<td data-label="Acciones">
						<GroupedActions text="Acciones" position="right">
							<div class="w1 flex column astart">
								<button
									type="button"
									class="btn btn-dark"
									on:click={() => (showUpsertDialog = true)}
								>
									Editar
								</button>
							</div>
						</GroupedActions>
					</td>
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
		<AsyncForm showButtons={false} method="post">
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
				<button type="submit" class="btn btn-dark">Crear lesión</button>
			</div>
		</AsyncForm>
	</Dialog>
</PageWrapper>
