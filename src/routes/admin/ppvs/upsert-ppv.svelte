<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import type { PPV } from '@prisma/client';
	import Calendar from './calendar.svelte';

	export let ppvs: PPV[];
</script>

<div class="w1 grid grid-two-column gap-medium responsive">
	<Box title="Datos" icon="info-circle">
		<div class="w1 flex column gap-small">
			<div class="w1 grid grid-two-column gap-small responsive">
				<Input label="Nombre" name="name" required />
				<Input label="Abreviatura" name="abbreviation" maxLength={5} required />
			</div>
			<Input label="Combate especifico" name="specific_match" />
			<ImageInput label="Imagen" name="image" />
			<RadioList
				label="Activo"
				name="active"
				options={[
					{
						value: 'weekly',
						label: 'Semanal'
					},
					{
						value: 'ppv',
						label: 'PPV'
					},
					{
						value: 'special',
						label: 'Especial'
					},
					{
						value: 'tbd',
						label: 'Por definir'
					}
				]}
			/>

			<div class="w1 grid grid-two-column gap-small responsive">
				<ToggleInput label="Visible" name="visible" />
				<ToggleInput label="Activo" name="active" />
			</div>
		</div>
	</Box>

	<Box title="Calendario" icon="calendar-event">
		<div class="w1 grid grid-two-column gap-small responsive">
			<Input label="Estadio" name="stadium" />
			<Input label="Ciudad" name="city" />
		</div>

		<Calendar bind:ppvs />
	</Box>
</div>
