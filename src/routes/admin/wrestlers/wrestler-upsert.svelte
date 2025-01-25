<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import BrandsSelector from '$lib/components/forms/inputs/brands-selector.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import type { wrestler as Wrestler } from '@prisma/client';

	export let wrestler: Wrestler = {} as Wrestler;
</script>

<div class="grid two-column-grid responsive gap-medium">
	{#if wrestler.id}
		<input type="hidden" name="_update_id" value={wrestler.id} />
	{/if}
	<Box title="Información" icon="info-circle">
		<Input
			label="Nombre"
			name="name"
			type="text"
			placeholder="Nombre del luchador"
			value={wrestler.name}
			required
		/>
		<Input
			label="Alias"
			name="alias"
			type="text"
			placeholder="Nombre del luchador"
			value={wrestler.alias as string}
		/>
		<Input
			label="Finisher"
			name="finisher"
			type="text"
			required
			placeholder="Finisher del luchador"
			value={wrestler.finisher as string}
		/>
		<Input
			label="Media"
			name="overall"
			type="number"
			placeholder="85"
			inputmode="numeric"
			value={wrestler.overall.toString()}
		/>
	</Box>

	<Box title="Datos de estados" icon="file-bar-graph">
		<Input
			label="Twitter"
			name="twitter_acc"
			type="text"
			placeholder="Cuenta de Twitter"
			value={wrestler.twitter_acc as string}
		/>
		<Input
			label="Nombre de Twitter"
			name="twitter_name"
			type="text"
			placeholder="Nombre de Twitter"
			value={wrestler.twitter_name as string}
		/>

		<BrandsSelector value={wrestler.brand as any} />
	</Box>

	<Box title="Imágenes" icon="image">
		<ImageInput label="Imagen de luchador" name="image" image={wrestler.image_name as string} />
		<ImageInput
			label="Imagen de twitter"
			name="twitter-image"
			image={wrestler.twitter_image as string}
		/>
	</Box>
</div>
