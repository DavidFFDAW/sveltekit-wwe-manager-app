<script lang="ts">
	import Dialog from '$lib/components/dialog/dialog.svelte';
	import Icon from '$lib/components/icons/icon.svelte';
	import { HttpService } from '$lib/services/http.service';
	import { Toast } from '$lib/utils/toast.helper';
	import type { ImgurImage } from '../../../../@types/Imgur';

	let opened: boolean = false;
	let imgurImage: ImgurImage[] = [];
	export let value: string = '';

	async function fetchImages() {
		const response = await HttpService.get('/api/imgur/images');
		if (!response.ok) return Toast.error('Error al obtener las imagenes de Imgur');

		imgurImage = response.response.images as ImgurImage[];
		opened = true;
	}

	const selectImage = (event: MouseEvent) => {
		const target = event.target as HTMLImageElement;
		if (target.getAttribute('data-url')) {
			value = target.dataset.url as string;
			opened = false;
		}
	};
</script>

<div>
	<button type="button" class="btn imgur icon" on:click={fetchImages}>
		<Icon icon="image" />
		Imgur
	</button>

	<Dialog bind:opened>
		<div class="gallery overflow-vertical h1">
			{#each imgurImage as image}
				<img
					src={image.link}
					alt={image.title}
					draggable="false"
					role="presentation"
					data-url={image.link}
					loading="lazy"
					on:click={selectImage}
				/>
			{/each}
		</div>
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
		padding: 10px;
		border: 1px solid #ccc;
	}

	@media (max-width: 768px) {
		.gallery {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		}
	}
</style>
