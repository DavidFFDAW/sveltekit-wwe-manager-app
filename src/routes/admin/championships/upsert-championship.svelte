<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import BrandsSelector from '$lib/components/forms/inputs/brands-selector.svelte';
	import CoverImage from '$lib/components/forms/inputs/cover-image.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import { Utils } from '$lib/utils/general.utils';
	import type { Championship } from '@prisma/client';
	export let championshipDatas: Championship;

	let name = championshipDatas.name as string;
	let slug = championshipDatas.metadata as string;
	$: slug = name ? Utils.slugify(name) : slug;
</script>

<Box title="Datos">
	<Input
		type="text"
		name="name"
		label="Nombre"
		bind:value={name}
		maxLength={100}
		placeholder="Nombre del campeonato"
		required
	/>
	<Input
		type="text"
		name="slug"
		label="Slug"
		bind:value={slug}
		maxLength={100}
		required
		placeholder="slug-del-campeonato"
	/>
	<ImageInput name="image" label="Imagen" bind:image={championshipDatas.image} />
	<BrandsSelector value={championshipDatas.brand} />
</Box>

<Box title="Datos de estado">
	<Input
		type="number"
		name="order"
		label="Orden"
		bind:value={championshipDatas.order}
		placeholder="Orden para muestreo"
		maxLength={2}
	/>
	<Input
		type="text"
		name="short_title"
		label="Nombre corto"
		placeholder="Nombre corto del campeonato"
		bind:value={championshipDatas.short_title}
		maxLength={20}
	/>
	<RadioList
		name="gender"
		label="Genero"
		options={[
			{
				label: 'Masculino',
				value: 'M'
			},
			{
				label: 'Femenino',
				value: 'F'
			}
		]}
		bind:value={championshipDatas.gender}
	/>

	<div class="w1 flex total gap-smaller">
		<ToggleInput label="Activo" name="active" bind:checked={championshipDatas.active} />
		<ToggleInput label="Tag Team" name="tag_team" bind:checked={championshipDatas.tag} />
	</div>
</Box>

<div class="ondesktop">
	<Box icon="image" title="Subida de imagen">
		<CoverImage
			name="image"
			imageQuality={0.8}
			imageType={'image/webp'}
			templateImage="/unknown-championship.webp"
			bind:value={championshipDatas.image}
			width={500}
			height={500}
		/>
	</Box>
</div>
