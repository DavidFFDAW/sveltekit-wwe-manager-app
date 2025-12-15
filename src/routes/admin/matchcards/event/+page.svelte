<script lang="ts">
	import Input from '$lib/components/forms/inputs/input.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import DateInput from '$lib/components/forms/date/date-input.svelte';
	import { Utils } from '$lib/utils/general.utils';

	export let data;
	const ppvs = data.event_card.ppvs;
	const pagedatas = data.event_card;

	let ppvName = pagedatas.event?.ppv_name || '';
	let ppvImage = pagedatas.event?.ppv_image || '';
	let ppvDate =
		pagedatas.event && pagedatas.event.ppv_date
			? Utils.formatFlatpickrDate(pagedatas.event?.ppv_date)
			: '';

	const currentYear = new Date().getFullYear();
</script>

<div class="matchcard-event-page">
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
						<Input
							type="text"
							label="Nombre de PPV"
							name="ppv_name"
							bind:value={ppvName}
							options={ppvs.map((ppv) => ppv.name)}
						/>
						<DateInput
							label="Fecha de realizacion"
							name="ppv_date_done"
							min={`${currentYear - 1}-01-01`}
							max={`${currentYear + 1}-12-31`}
							bind:value={ppvDate as string}
						/>
					</div>
					<ImageInput label="Imagen de PPV" name="ppv_image" bind:image={ppvImage} />
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

	<section class="w1 box gemini-ai-block ai-generation-block down">
		<header class="gemini-header">
			<h3 class="uppercase">Generar resumen del evento con IA</h3>
			<small class="subtitle">
				Utiliza la inteligencia artificial para generar un resumen del evento de lucha libre. En
				este bloque se enviarán los combates y los resultados además de las posibles indicaciones
				extras que puedas indicar para generar un artículo resumen acerca del evento.
			</small>
		</header>
	</section>
</div>

<style>
	.gemini-ai-block.ai-generation-block.down {
		margin-top: 3rem;
	}
</style>
