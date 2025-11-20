<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import { PPVConstants } from '$lib/constants/ppv.constants';
	import type { PPV } from '@prisma/client';
	import { onMount } from 'svelte';
	
	import flatpickr from 'flatpickr';

	export let ppv: PPV = {} as PPV;
	export let ppvs: PPV[];
	const isUpdating = Boolean(ppv.id);

	const generateAbbreviation = (name: string) =>
		name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase();

	const today = new Date();
	let name = ppv.name || '';
	let abbreviation = ppv.abbreviation || '';
	let ppvType = ppv.type || 'ppv';
	let ppvDate = ppv.game_date ? ppv.game_date.toISOString().split('T')[0] : '';
	$: abbreviation = isUpdating ? abbreviation : generateAbbreviation(name);

	onMount(() => {
		const ppvObject = ppvs.reduce((obj, item) => {
			const date = item.game_date ? item.game_date.toISOString().split('T')[0] : '';
			obj[date] = item;
			return obj;
		}, {} as Record<string, PPV>);

		flatpickr('#game_date', {
			inline: true,
			showMonths: 2,
			dateFormat: 'Y-m-d',
			minDate: `${today.getFullYear()}-01-01`,
			maxDate: `${today.getFullYear() + 1}-12-31`,
			disable: Object.keys(ppvObject).filter((date) => date !== ppvDate),
			defaultDate: ppvDate || undefined,
			locale: {
				firstDayOfWeek: 1,
				weekdays: {
					shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
					longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
				},
				months: {
					shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
					longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
				}
			},
			onDayCreate: (dObj, dStr, fp, dayElem) => {
				const currentDate = dayElem.dateObj;
				const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

				const event = ppvObject[dateKey];
				if (event) {
					dayElem.classList.add("w-event-day");
					dayElem.title = event.name;
					if (event.image) {
						dayElem.style.backgroundImage = `url(${event.image})`;
					}
				}
			},
		});
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
</svelte:head>

<div class="w1 grid grid-two-column gap-medium responsive">
	<Box title="Datos" icon="info-circle">
		<div class="w1 flex column gap-small">
			<div class="w1 grid grid-two-column gap-small responsive">
				<Input label="Nombre" name="name" required bind:value={name} />
				<Input
					label="Abreviatura"
					name="abbreviation"
					maxLength={5}
					bind:value={abbreviation}
					required
				/>
			</div>
			<Input
				label="Combate especifico"
				name="specific_match"
				bind:value={ppv.specific_match_type}
			/>
			<ImageInput label="Imagen" name="image" bind:image={ppv.image as string} />
			<RadioList label="Activo" name="ppv_type" bind:value={ppvType} options={PPVConstants.types} />

			<div class="w1 description-block form-item">
				<label class="label form-label" for="description">Descripcion</label>
				<textarea
					id="description"
					class="description"
					placeholder="Descripción"
					name="description"
					bind:value={ppv.description}
				></textarea>
			</div>

			<div class="w1 grid grid-two-column gap-small">
				<ToggleInput label="Visible" name="visible" bind:checked={ppv.visible} />
				<ToggleInput label="Activo" name="active" bind:checked={ppv.active} />
			</div>
		</div>
	</Box>

	<Box title="Calendario" icon="calendar-event">
		<div class="w1 grid grid-two-column gap-small responsive">
			<Input label="Estadio" name="stadium" bind:value={ppv.stadium} />
			<Input label="Ciudad" name="city" bind:value={ppv.city} />
		</div>

		<div class="w1 flatpickr-container" style="padding: 0 10px">
			<label class="label form-label" for="game_date">Fecha del PPV</label>
			<input
				type="date"
				id="game_date"
				name="game_date"
				class="w1 flatpickr-input"
				bind:value={ppvDate}
			/>
		</div>
	</Box>
</div>


<style>
	:global(.flatpickr-day.w-event-day) {
		position: relative;
		color: #fff;
		background-color: #333 !important;
		background-size: contain !important;
		background-position: center !important;
		background-repeat: no-repeat !important;
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	:global(.flatpickr-day.w-event-day:hover) {
		background-size: cover;
		background-position: center;
		filter: brightness(0.8);
		cursor: pointer;
	}
</style>