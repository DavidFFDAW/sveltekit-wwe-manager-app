<script lang="ts">
	import Gallery from '$lib/components/gallery/gallery.svelte';
	import Imgur from '$lib/components/modules/imgur/imgur.svelte';
	import { Utils } from '$lib/utils/general.utils';

	const size = 120;
	export let label: string;
	export let name: string;
	export let image = '';
	export let required = false;
	export let placeholder = '/noimage.jpg';
	const randomId = Utils.getRandomID(name);

	function handleImageError(event: Event) {
		const image = event.target as HTMLImageElement;
		image.src = '/noimage.jpg';
	}
</script>

<div class="form-item form-item-horizontal form-item-image">
	<img
		src={image || '/noimage.jpg'}
		alt="Imagen seleccionada"
		width={size}
		height={size}
		on:error={handleImageError}
	/>
	<div class="w1 flex start column astart gap-smaller">
		<div class="w1 flex astart column gap-smaller">
			<label
				class="w1 label form-label flex between"
				class:required-label={required}
				for={`${name}-${randomId}`}
			>
				<span>
					{label}
					{#if required}
						<span class="required-label">*</span>
					{/if}
				</span>

				<small class="sourcesans">{image.toString().length} / 255</small>
			</label>
			<input
				type="text"
				{name}
				bind:value={image}
				id={`${name}-${randomId}`}
				maxlength="255"
				{placeholder}
				{required}
			/>
			{#if image.toString().length > 255}
				<p class="error-message">
					Este valor es demasiado largo. Intenta reducirlo a un máximo de 255 caracteres.
				</p>
			{/if}
		</div>
		<div class="w1 flex gap-smaller">
			<Gallery bind:value={image} />
			<Imgur bind:value={image} />
		</div>
	</div>
</div>

<style>
	@media only screen and (max-width: 768px) {
		.form-item.form-item-horizontal.form-item-image {
			align-items: flex-start;
		}
		.form-item.form-item-horizontal.form-item-image > img {
			width: 80px;
			height: 80px;
		}
	}
</style>
