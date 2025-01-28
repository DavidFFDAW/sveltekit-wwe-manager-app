<script lang="ts">
	import Gallery from '$lib/components/gallery/gallery.svelte';
	import Imgur from '$lib/components/modules/imgur/imgur.svelte';

	const size = 120;
	export let label: string;
	export let name: string;
	export let image = '';
	export let required = false;
	export let placeholder = '/noimage.jpg';
	const randomId = Math.random().toString(36).substring(7);

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
			<label class="label form-label" class:required-label={required} for={`${name}-${randomId}`}
				>{label}
				{#if required}
					<span class="required-label">*</span>
				{/if}
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
		</div>
		<div class="w1 flex gap-smaller">
			<Gallery bind:value={image} />
			<Imgur bind:value={image} />
		</div>
	</div>
</div>
