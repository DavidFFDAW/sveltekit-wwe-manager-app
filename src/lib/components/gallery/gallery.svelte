<script lang="ts">
	import Dialog from '../dialog/dialog.svelte';
	import { getGalleryImages, type GalleryImage } from './gallery.service';

	let opened: boolean = false;
	let images: GalleryImage[] = [];
	export let value: string = '';
	let active: string = '';

	const getImages = async () => {
		const fetchedImages = await getGalleryImages();
		images = fetchedImages;
		if (images.length > 0) opened = true;
	};

	const selectImage = (event: MouseEvent) => {
		const target = event.target as HTMLImageElement;
		active = target.dataset.url as string;

		if (target.getAttribute('data-url')) {
			value = target.dataset.url as string;
			opened = false;
		}
	};
</script>

<div>
	<button type="button" class="btn secondary" on:click={getImages}>Galeria</button>

	<Dialog bind:opened>
		<div class="gallery overflow-vertical h1">
			{#each images as image}
				<img
					src={image.url}
					alt={image.name}
					class:active={image.url === active}
					draggable="false"
					role="presentation"
					data-url={image.url}
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
		height: auto;
		border: 1px solid #ccc;
		cursor: pointer;
	}

	.gallery img:hover {
		border: 1px solid #c91727;
		background-color: #f9f9f9;
	}

	@media (max-width: 768px) {
		.gallery {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		}
		.gallery img {
			height: 100%;
		}
	}
</style>
