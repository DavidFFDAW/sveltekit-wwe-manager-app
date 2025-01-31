<script lang="ts">
	import Dialog from '$lib/components/dialog/dialog.svelte';
	import Icon from '$lib/components/icons/icon.svelte';
	import { HttpService } from '$lib/services/http.service';
	import { Toast } from '$lib/utils/toast.helper';
	import { fade } from 'svelte/transition';
	import type { ImgurImage } from '../../../../@types/Imgur';
	import ImgurUpload from './imgur-upload.svelte';

	let opened: boolean = false;
	let imgurImages: ImgurImage[] = [];
	let view: 'images' | 'upload' = 'images';
	export let value: string = '';

	async function fetchImages() {
		const response = await HttpService.get('/api/imgur/images');
		if (!response.ok) return Toast.error('Error al obtener las imagenes de Imgur');

		imgurImages = response.response.images as ImgurImage[];
		opened = true;
	}

	const selectImage = (event: MouseEvent) => {
		const target = event.target as HTMLImageElement;
		if (target.getAttribute('data-url')) {
			value = target.dataset.url as string;
			opened = false;
		}
	};

	function deleteImage(image: ImgurImage) {
		return async () => {
			const confirmation = confirm('¿Estás seguro de eliminar la imagen?');
			if (!confirmation) return;

			const response = await HttpService.delete(`/api/imgur/delete/${image.deletehash}`);
			if (!response.ok) return Toast.error('Error al eliminar la imagen de imgur');

			imgurImages = imgurImages.filter((img) => img.id !== image.id);
			return Toast.success('Imagen eliminada correctamente');
		};
	}
</script>

<div>
	<button type="button" class="btn imgur icon" on:click={fetchImages}>
		<Icon icon="image" />
		Imgur
	</button>

	<Dialog bind:opened>
		<div class="header-buttons-container" slot="header">
			<label class="block relative labeled-radio" class:selected={view === 'images'}>
				<input type="radio" class="app-radio" value="images" bind:group={view} />
				<span>Imágenes</span>
			</label>
			<label class="block relative labeled-radio" class:selected={view === 'upload'}>
				<input type="radio" class="app-radio" value="upload" bind:group={view} />
				<span>Subir imágenes</span>
			</label>
		</div>

		{#if view === 'images'}
			<div class="gallery overflow-vertical h1" transition:fade>
				{#each imgurImages as image}
					<div class="relative">
						<img
							src={image.link}
							alt={image.title}
							draggable="false"
							role="presentation"
							data-url={image.link}
							loading="lazy"
							on:click={selectImage}
						/>

						<button
							type="button"
							class="btn absolute top right btn-danger btn-small"
							on:click={deleteImage(image)}
						>
							<Icon icon="x" />
						</button>
					</div>
				{/each}
			</div>
		{:else}
			<ImgurUpload bind:images={imgurImages} />
		{/if}
	</Dialog>
</div>

<style>
	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}

	.gallery img {
		width: 100%;
		height: 100%;
		min-height: 144px;
		padding: 10px;
		border: 1px solid #ccc;
	}

	.header-buttons-container {
		display: flex;
		justify-content: space-between;
		padding: 1rem;
	}

	.header-buttons-container label {
		height: 34px;
		padding: 6px 12px;
		border-radius: 0;
		background-color: #fff;
		color: #333;
		cursor: pointer;
	}

	.header-buttons-container label:first-child {
		border-radius: 6px 0 0 6px;
	}

	.header-buttons-container label:last-child {
		border-radius: 0 6px 6px 0;
	}

	.header-buttons-container label.selected {
		background-color: #333;
		color: #fff;
	}

	@media (max-width: 768px) {
		.gallery {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		}
	}
</style>
