<script lang="ts">
	import Input from '$lib/components/forms/inputs/input.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import DateInput from '$lib/components/forms/date/date-input.svelte';
	import { Utils } from '$lib/utils/general.utils';
	import { page } from '$app/state';
	import Box from '$lib/components/box/box.svelte';
	import { errorimage } from '$lib/actions/error.image';

	export let data;
	const ppvs = data.event_card.ppvs;
	const pagedatas = data.event_card;

	let upsertCard = {
		name: pagedatas.event?.ppv_name || '',
		image: pagedatas.event?.ppv_image || '',
		date:
			pagedatas.event && pagedatas.event.ppv_date
				? Utils.formatFlatpickrDate(pagedatas.event?.ppv_date)
				: ''
	};

	const handleSetDatasPPV = (ppv: any) => (event: Event) => {
		event.preventDefault();
		upsertCard.name = ppv.name;
		upsertCard.image = ppv.image;
		upsertCard.date = Utils.formatFlatpickrDate(ppv.game_date);
	};

	const currentYear = new Date().getFullYear();
</script>

<div class="matchcard-event-page">
	<div class="w1 ppv-importation-block">
		<Box title="Importar datos de PPV" icon="bi bi-file-earmark-arrow-up">
			<div class="w1 ppv-importation-list-container">
				<div class="ppv-importation-list">
					{#each pagedatas.importPPV as ppv}
						<button type="button" onclick={handleSetDatasPPV(ppv)} class="ppv-importation-card">
							<img
								src={ppv.image}
								alt={ppv.name}
								width="80"
								height="80"
								use:errorimage={'/noimage.jpg'}
							/>
							<div class="ppv-name">{ppv.name}</div>
						</button>
					{/each}
				</div>
			</div>
		</Box>
	</div>

	<AsyncForm
		method="post"
		classes="w1"
		redirect="/admin/matchcards"
		showButtons={false}
		updateId={pagedatas.event?.id}
	>
		<input type="hidden" name="_action" value={pagedatas.isUpdate ? 'update' : 'create'} />

		<div class="w1 flex column gap-medium">
			<div class="w1 ppv-container box flex column gap-medium astart">
				<h2 class="uppercase dreadnotus">{pagedatas.isUpdate ? 'Editar' : 'Crear'} Evento</h2>
				<div class="w1 grid grid-two-column gap-small responsive ppv-datas astart">
					<div class="w1 flex column gap-smaller">
						<div class="w1">
							<Input
								type="text"
								label="Nombre de PPV"
								name="ppv_name"
								bind:value={upsertCard.name}
								placeholder="Wrestlemania 39"
								options={data.event_card.ppvs}
							/>
							<small>No incluyas el año en el nombre del PPV</small>
						</div>

						<DateInput
							label="Fecha de realizacion"
							name="ppv_date_done"
							min={`${currentYear - 1}-01-01`}
							max={`${currentYear + 1}-12-31`}
							value={upsertCard.date}
						/>
					</div>
					<ImageInput label="Imagen de PPV" name="ppv_image" bind:image={upsertCard.image} />
				</div>
			</div>

			<div class="w1 flex end acenter gap-smaller">
				<button type="submit" class="btn cta rounded icon">
					<i class="bi bi-save"></i>
					<span>Guardar evento</span>
				</button>
			</div>
		</div>
	</AsyncForm>
</div>

<style>
	.ppv-importation-block {
		margin-bottom: 3rem;
	}

	.ppv-importation-list {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 6px;
	}
	.ppv-importation-card {
		position: relative;
		min-height: 100px;
		background-color: #333;
		border: none;
		border-radius: 6px;
		overflow: hidden;
		cursor: pointer;
	}
	.ppv-importation-card::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 0;
	}

	.ppv-importation-card .ppv-name {
		position: absolute;
		width: 100%;
		text-align: center;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		font-weight: bold;
		color: #fff;
		z-index: 2;
		font-size: 1rem;
	}
</style>
