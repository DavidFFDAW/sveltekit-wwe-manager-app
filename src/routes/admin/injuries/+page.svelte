<script lang="ts">
	import Dialog from '$lib/components/dialog/dialog.svelte';
	import DateInput from '$lib/components/forms/date/date-input.svelte';
	import RangeDateInput from '$lib/components/forms/date/range-date-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import WrestlersSelector from '$lib/components/forms/selector/specific/wrestlers-selector.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import { fade } from 'svelte/transition';

	export let data;
	let injuryData = {
		injury: '',
		startDate: '',
		endDate: '',
		wrestlerId: 0,
		rangeDates: ['', '']
	};
	let showUpsertDialog: boolean = false;
</script>

<PageWrapper page="admin-injuries-page">
	<h1>Injuries</h1>
	<div class="w1 flex total between astart gap-medium responsive">
		<div class="w1 selected-wrestler-block wrestler-technical-sheet" transition:fade>
			<div class="w1 flex astart gap-small">
				<p class="wrestler-name">Wrestler Name</p>
				<p class="wrestler-status">Status</p>
			</div>
			<div class="w1 wrestler-image-container">
				<img src="/noimage.jpg" alt="Wrestler Name" width={80} height={80} class="wrestler-image" />
			</div>
			<div class="w1 flex end gap-small down">
				<button
					type="button"
					class="btn btn-dark"
					on:click={() => (showUpsertDialog = !showUpsertDialog)}
				>
					Crear lesión
				</button>
			</div>
		</div>
	</div>

	<Dialog bind:opened={showUpsertDialog}>
		<form method="post" class="w1 flex column gap-medium">
			<div class="w1 flex between astart gap-small">
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
					<div class="w1 flex-1 flex gap-small astart responsive">
						<RangeDateInput
							name="injury-dates"
							label="Inicio"
							required={false}
							bind:startDate={injuryData.startDate}
							bind:endDate={injuryData.endDate}
						/>
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
		</form>
	</Dialog>
</PageWrapper>
