<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import { PPVConstants } from '$lib/constants/ppv.constants';
	import PpvCalendar from './ppv-calendar.svelte';
	import type { PPV } from '@prisma/client';

	export let ppv: PPV = {} as PPV;
	export let ppvs: PPV[];
	const isUpdating = Boolean(ppv.id);

	const generateAbbreviation = (name: string) =>
		name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase();

	let name = ppv.name || '';
	let abbreviation = ppv.abbreviation || '';
	let ppvType = ppv.type || 'ppv';
	let ppvDate = ppv.game_date ? ppv.game_date.toISOString().split('T')[0] : '';
	$: abbreviation = isUpdating ? abbreviation : generateAbbreviation(name);
</script>

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

		<PpvCalendar bind:ppvs name="game_date" label="Fecha en el juego" bind:selectedDate={ppvDate} />
	</Box>
</div>
