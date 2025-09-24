<script lang="ts">
	import Input from '$lib/components/forms/inputs/input.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import DateInput from '$lib/components/forms/date/date-input.svelte';
	import { Utils } from '$lib/utils/general.utils';
	import IaTextarea from '$lib/components/forms/inputs/ia-textarea.svelte';
	import type { Match } from '@prisma/client';

	export let data;
	const ppvs = data.event_card.ppvs;
	const pagedatas = data.event_card;
	let content = '';
	let prompt: string = '';

	let ppvName = pagedatas.event?.ppv_name || '';
	let ppvImage = pagedatas.event?.ppv_image || '';
	let ppvDate =
		pagedatas.event && pagedatas.event.ppv_date
			? Utils.formatFlatpickrDate(pagedatas.event?.ppv_date)
			: '';

	const currentYear = new Date().getFullYear();

	const matches = pagedatas.event?.matches || [];
	prompt = `Genera un resumen detallado en español del evento de lucha libre profesional ${ppvName}, que se llevó a cabo el ${ppvDate}. El resumen debe incluir los resultados de los siguientes combates: ${matches
		.map((match: Match) => {
			return `${match.participants}, ganador: ${match.winner || 'sin definir'}`;
		})
		.join(
			', '
		)}. Asegúrate de que el resumen sea coherente y atractivo, destacando los momentos clave del evento y proporcionando contexto sobre la importancia de cada combate. Si hay alguna indicación extra, inclúyela también.`;
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
							min={`${currentYear}-01-01`}
							max={`${currentYear}-12-31`}
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

		<div class="gemini-body down">
			<AsyncForm
				method="post"
				classes="w1"
				redirect="/admin/matchcards/event/{pagedatas.event?.id}"
				showButtons={false}
			>
				<input type="hidden" name="_action" value="generate_event_summary" />
				<div class="w1 flex column gap-small">
					<label class="form-item">
						<span class="label form-label">Instrucciones extra para la IA</span>
						<textarea
							name="event_summary_prompt"
							class="form-input w1"
							placeholder="Escribe las instrucciones extras para que la IA genere el resumen del evento."
							rows={4}
						></textarea>
					</label>
				</div>

				<div class="w1 flex end acenter gap-smaller mt-small">
					<IaTextarea
						label="Contenido"
						name="content"
						placeholder="Contenido del post"
						bind:value={content}
						{prompt}
						required
					/>
				</div>
			</AsyncForm>
		</div>
	</section>
</div>

<style>
	.gemini-ai-block.ai-generation-block.down {
		margin-top: 3rem;
	}
</style>
