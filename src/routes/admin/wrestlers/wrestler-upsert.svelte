<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import BrandsSelector from '$lib/components/forms/inputs/brands-selector.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import { WrestlerConstants } from '$lib/constants/wrestler.constants';
	import type { Wrestler } from '@prisma/client';
	import CoverImage from '$lib/components/forms/inputs/cover-image.svelte';
	import { Utils } from '$lib/utils/general.utils';

	export let wrestler: Wrestler = {} as Wrestler;
	let name = wrestler.name as string;
	let slug = wrestler.slug as string;
	let image = wrestler.image_name as string;
	$: slug = name ? Utils.slugify(name) : slug;
</script>

<div class="grid two-column-grid responsive gap-medium">
	<Box title="Datos obligatorios" icon="info-circle">
		<Input
			label="Nombre"
			name="name"
			type="text"
			placeholder="Nombre del luchador"
			bind:value={name}
			required
		/>

		<Input
			label="Slug"
			name="slug"
			type="text"
			placeholder="Slug del luchador"
			bind:value={slug}
			maxLength={200}
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
			value={wrestler.overall}
		/>

		<RadioList
			label="Genero"
			name="gender"
			options={WrestlerConstants.genders}
			value={wrestler.sex as string}
		/>
	</Box>

	<Box title="Datos de estados" icon="file-bar-graph">
		<RadioList
			label="Estado de kayfabe"
			name="kayfabe_status"
			options={WrestlerConstants.kayfabeStatuses}
			bind:value={wrestler.kayfabe_status as string}
		/>
		<RadioList
			label="Estado"
			name="status"
			options={WrestlerConstants.statuses}
			bind:value={wrestler.status as string}
		/>
		<BrandsSelector value={wrestler.brand as any} />
	</Box>

	<Box title="Datos de Twitter" icon="twitter" classes="twitter-panel">
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

		<ImageInput
			label="Imagen de twitter"
			name="twitter-image"
			image={wrestler.twitter_image as string}
		/>
	</Box>

	<Box title="Imagenes" icon="image">
		<ImageInput label="Imagen de luchador" name="image" bind:image />
	</Box>

	<Box title="Bloque imagen" icon="image-fill">
		<CoverImage
			width={512}
			height={512}
			imageQuality={0.9}
			imageType="image/webp"
			name="wrestler-image-upload"
			templateImage="https://davidfernandezdeveloper.es/2k/images/cody-rhodes.webp"
			bind:imageName={slug}
			bind:value={image}
		/>
	</Box>
</div>
