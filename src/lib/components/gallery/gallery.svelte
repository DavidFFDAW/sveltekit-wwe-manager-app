<script lang="ts">
	import { Utils } from '$lib/utils/general.utils';
	import Dialog from '../dialog/dialog.svelte';
	import { getGalleryImages, type GalleryImage } from './gallery.service';

	let opened: boolean = false;
	let originalImages: GalleryImage[] = [];
	let showingImages: GalleryImage[] = originalImages;
	export let value: string = '';
	let active: string = '';

	const getImages = async () => {
		const fetchedImages = await getGalleryImages();
		originalImages = fetchedImages;
		showingImages = fetchedImages;
		if (originalImages.length > 0) opened = true;
	};

	const selectImage = (event: MouseEvent) => {
		const target = event.target as HTMLImageElement;
		active = target.dataset.url as string;

		if (target.getAttribute('data-url')) {
			value = target.dataset.url as string;
			opened = false;
		}
	};

	const searchImages = (event: Event) => {
		if (!originalImages.length) return;
		if (!event.target || !(event.target instanceof HTMLInputElement)) return;
		const input = event.target as HTMLInputElement;
		const searchTerm = Utils.slugify(input.value);

		showingImages = searchTerm
			? originalImages.filter((image) => image.name.toLowerCase().includes(searchTerm))
			: originalImages;
	};
</script>

<div>
	<button type="button" class="btn secondary" on:click={getImages}>Galeria</button>

	<Dialog bind:opened>
		<header class="filters-header">
			<input
				type="search"
				class="input"
				placeholder="Buscar imagen..."
				bind:value
				on:change={searchImages}
			/>
		</header>

		<div class="gallery overflow-vertical h1">
			{#each showingImages as image}
				<div class="gallery-item">
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
					<small class="sourcesans">{image.name}</small>
				</div>
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
		border-radius: 10px 10px 0 0;
		cursor: pointer;
	}

	.gallery img:hover {
		border: 1px solid #c91727;
		background-color: #f9f9f9;
	}

	.gallery .gallery-item {
		padding: 10px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.gallery .gallery-item small {
		display: block;
		width: 100%;
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		border-top: none;
		border-radius: 0 0 10px 10px;
		padding: 5px;
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
