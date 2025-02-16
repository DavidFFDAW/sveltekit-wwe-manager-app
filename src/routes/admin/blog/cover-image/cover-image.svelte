<script lang="ts">
	import { onMount } from 'svelte';
	import { fabric } from 'fabric';
	import editorUtils from '../../image-editor/editor.utils';
	import { Toast } from '$lib/utils/toast.helper';
	import { droppableImages } from '$lib/actions/droppable.images';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import ImgurService from '$lib/services/imgur.service';
	import Icon from '$lib/components/icons/icon.svelte';

	const width = 800;
	const height = 450;
	let imageQuality = 0.7;
	let imageType = 'image/jpeg';
	let canvas: HTMLCanvasElement;
	let fab: fabric.Canvas;
	let blob: Blob | null;
	let isEmpty: boolean = true;
	export let value: string = '';

	const checkIfCanvasEmpty = () => {
		isEmpty = fab.getObjects().length === 0;
	};

	const removeSelectedItem = () => {
		const activeItem = fab.getActiveObject();
		if (activeItem) fab.remove(activeItem);
	};

	onMount(() => {
		fab = new fabric.Canvas(canvas, {
			width,
			height,
			backgroundColor: 'transparent'
		});

		fab.on('object:added', checkIfCanvasEmpty);
		fab.on('object:removed', checkIfCanvasEmpty);

		return () => {
			fab.off('object:added', checkIfCanvasEmpty);
			fab.off('object:removed', checkIfCanvasEmpty);
			fab.dispose();
		};
	});

	const getFileFromCanvas = () => {
		// if (fab.isEmpty()) return '';
		fab.discardActiveObject().renderAll();
		canvas.toBlob(
			(genBlob) => {
				if (!genBlob) return Toast.error('No se pudo generar la imagen.');
				const url = URL.createObjectURL(genBlob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'image.jpg';
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
			},
			imageType,
			imageQuality
		);
	};

	const adjustImage = () => {
		const activeObject = fab.getObjects()[0];
		if (!activeObject) return;

		activeObject.scaleToWidth(width + 50);
		activeObject.set({
			left: (width + 50 - activeObject.getScaledWidth()) / 2,
			top: (height + 50 - activeObject.getScaledHeight()) / 2
		});
		activeObject.setCoords();
		fab.renderAll();
	};

	const addImageToCanvas = async (image: File) => {
		fab.clear();
		const imageData = await editorUtils.readFile(image);

		fab.add(
			new fabric.Image(imageData.image, {
				left: 0,
				top: 0,
				opacity: 1,
				backgroundColor: 'transparent',
				width: imageData.width,
				height: imageData.height,
				borderColor: '#127ddd',
				cornerColor: '#1273de',
				cornerSize: 15,
				transparentCorners: false,
				hasRotatingPoint: false,
				centeredScaling: true
			})
		);

		adjustImage();
	};

	const addImage = async (event: Event) => {
		fab.clear();
		if (!fab.isEmpty()) return Toast.error('No puedes añadir más de una imagen.');

		const target = event.target as HTMLInputElement;
		if (!target.files) return;
		const pfile = target.files[0];

		addImageToCanvas(pfile);
	};

	const checkBlob = () => {
		return new Promise((resolve) => {
			canvas.toBlob(
				(genblob) => {
					blob = genblob;
					if (genblob) resolve(genblob);
				},
				imageType,
				imageQuality
			);
		});
	};

	const dropFile = (event: DragEvent) => {
		if (!event.dataTransfer?.files) return false;
		const file = event.dataTransfer.files[0];

		if (!file) return false;
		addImageToCanvas(file);
	};

	const uploadToImgur = async () => {
		await checkBlob();
		if (!blob) return false;

		const wantToContinue = confirm(
			`Se va a subir la imagen con un peso aproximado de ${blob.size / 1000} KB, ¿Estás seguro?`
		);
		if (!wantToContinue) return false;

		const imgurResponse = await ImgurService.uploadImgurImage(blob as File);
		if (imgurResponse.error) return Toast.error(imgurResponse.message);
		console.log({ imgurResponse });

		if (imgurResponse.data) value = imgurResponse.data.link;
	};
</script>

<div style="--w: {width}px; --h: {height}px;" class="w1 flex start astart gap-medium container">
	<div class="w1 flex start astart column gap-smaller overflow-horizontal">
		{#if blob}
			<p>Tamaño estimado archivo: {(blob.size / 1000).toFixed(2)} KB</p>
		{/if}
		<div class="w1 canvas-container relative">
			{#if isEmpty}
				<div
					class="w1 flex center acenter overlay"
					role="presentation"
					use:droppableImages={dropFile}
				>
					<input type="file" class="app-file" accept="image/*" on:change={addImage} />
					<div class="iconed-medium">
						<i class="bi bi-filetype-jpg"></i>
					</div>
				</div>
			{/if}
			<canvas bind:this={canvas} {width} {height}></canvas>
		</div>
	</div>
	<div class="w1 inputs flex column gap-smaller">
		<div class="w1 flex start gap-smaller">
			<Input
				type="number"
				name=""
				label="Calidad"
				bind:value={imageQuality}
				step="0.1"
				min="0.1"
				max="1"
			/>
			<Input
				type="text"
				name=""
				label="Tipo de archivo"
				bind:value={imageType}
				placeholder="image/jpeg"
				options={['image/jpeg', 'image/png', 'image/webp']}
			/>
		</div>

		<div class="w1 button-container gap-5">
			<button type="button" class="btn danger icon" on:click={() => fab.clear()}>
				<Icon icon="trash" /> canva
			</button>
			<button type="button" class="btn danger icon" on:click={removeSelectedItem}>
				<Icon icon="trash" /> seleccionado
			</button>
			<button type="button" class="btn button icon cta" on:click={getFileFromCanvas}>
				<Icon icon="download" />
				Descargar
			</button>
			<button type="button" class="btn imgur icon" on:click={uploadToImgur}>
				<Icon icon="upload" />
				Subir
			</button>
			<button type="button" class="w1 btn button icon check-size secondary" on:click={checkBlob}>
				<Icon icon="filetype-jpg" />
				Comprobar el tamaño del archivo
			</button>
		</div>
	</div>
</div>

<style>
	.container {
		align-items: flex-start;
	}
	.canvas-container {
		width: var(--w);
	}
	.canvas-container .overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		z-index: 2;
	}

	.canvas-container .bi {
		font-size: 120px;
		color: #fff;
	}
	canvas {
		width: 100%;
		height: var(--h);
		background-color: transparent;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		overflow: hidden;
	}

	.flex.container {
		flex-direction: column;
	}

	.button-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}
	.check-size {
		grid-column: span 4;
	}
</style>
