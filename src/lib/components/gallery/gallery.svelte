<script lang="ts">
	import Icon from '../icons/icon.svelte';
	import { getGalleryImages, type GalleryImage } from './gallery.service';

	let dialog: HTMLDialogElement;
	let images: GalleryImage[] = [];
	export let value: string = '';

	const getImages = async () => {
		const fetchedImages = await getGalleryImages();
		images = fetchedImages;
		if (images.length > 0) dialog.showModal();
	};

	const closeDialog = () => {
		dialog.close();
	};

	const selectImage = (event: MouseEvent) => {
		const target = event.target as HTMLImageElement;
		const htmlImages = document.querySelectorAll('.gallery img');
		htmlImages.forEach((img) => img.classList.remove('active'));
		target.classList.add('active');

		if (target.getAttribute('data-url')) {
			value = target.dataset.url as string;
			closeDialog();
		}
	};
</script>

<div>
	<button type="button" class="btn secondary" on:click={getImages}>Galeria</button>

	<dialog class="gallery-dialog" bind:this={dialog}>
		<header>
			<button on:click={closeDialog}>
				<Icon icon="x" />
			</button>
		</header>

		<div class="gallery overflow-vertical h1">
			{#each images as image}
				<img
					src={image.url}
					alt={image.name}
					draggable="false"
					role="presentation"
					data-url={image.url}
					loading="lazy"
					on:click={selectImage}
				/>
			{/each}
		</div>
	</dialog>
</div>

<style>
	.gallery-dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 90%;
		height: 90%;
		outline: none;
		background-color: #fff;
		z-index: 10000000;
		transform: translate(-50%, -50%);
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border: 0;
	}

	.gallery-dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.6);
	}

	.gallery-dialog header {
		display: flex;
		justify-content: flex-end;
		padding: 1rem;
	}

	.gallery-dialog .gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}

	.gallery-dialog img {
		width: 100%;
		height: auto;
		padding: 10px;
		border: 1px solid #ccc;
		cursor: pointer;
	}

	.gallery-dialog img:hover {
		border: 1px solid #c91727;
		background-color: #f9f9f9;
	}

	.gallery-dialog img.active {
		border: 1px solid #c91727;
		background-color: #f9f9f9;
	}
</style>
