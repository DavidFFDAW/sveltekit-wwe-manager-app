<script lang="ts">
	import { onMount } from 'svelte';
	import { fabric } from 'fabric';
	import editorUtils from '../../../../routes/admin/image-editor/editor.utils';
	import { Toast } from '$lib/utils/toast.helper';
	import { droppableImages } from '$lib/actions/droppable.images';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import ImgurService from '$lib/services/imgur.service';
	import Icon from '$lib/components/icons/icon.svelte';
	import VpsService from '$lib/services/vps.service';

	export let width = 800;
	export let height = 450;
	export let imageType = 'image/jpeg';
	export let imageQuality = 0.7;
	export let imageName: string = '';
	let canvas: HTMLCanvasElement;
	let fab: fabric.Canvas;
	let blob: File | null;
	let isEmpty: boolean = true;
	export let value: string = '';
	export let name: string = '';
	export let templateImage = '';
	let dataURL: string = '';

	const checkIfCanvasEmpty = () => {
		isEmpty = fab.getObjects().length === 0;
	};

	const generateDataURL = () => {
		fab.discardActiveObject().renderAll();
		dataURL = canvas.toDataURL(imageType, 1);
	};

	onMount(() => {
		fab = new fabric.Canvas(canvas, {
			width,
			height,
			backgroundColor: 'transparent'
		});

		fab.on('object:added', checkIfCanvasEmpty);
		fab.on('object:removed', checkIfCanvasEmpty);
		fab.on('object:modified', generateDataURL);

		return () => {
			fab.off('object:added', checkIfCanvasEmpty);
			fab.off('object:removed', checkIfCanvasEmpty);
			fab.off('object:modified', generateDataURL);
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
				const extension = imageType.split('/')[1];
				a.download = `image.${extension}`;
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

		activeObject.scaleToWidth(width);
		activeObject.set({
			left: (width - activeObject.getScaledWidth()) / 2,
			top: (height - activeObject.getScaledHeight()) / 2
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
					const extension = imageType.split('/')[1];
					const name = imageName || `image-${Date.now()}`;
					const file = new File([genblob as Blob], `${name}.${extension}`, {
						type: imageType
					});
					blob = file;
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

	const confirmUpload = async () => {
		await checkBlob();
		if (!blob) return false;

		return confirm(
			`Se va a subir la imagen con un peso aproximado de ${blob.size / 1000} KB, ¿Estás seguro?`
		);
	};

	const uploadToImgur = async () => {
		const uploadContinue = await confirmUpload();
		if (!uploadContinue) return false;

		const imgurResponse = await ImgurService.uploadImgurImage(blob as File);
		if (imgurResponse.error) return Toast.error(imgurResponse.message);
		if (imgurResponse.data) value = imgurResponse.data.link;
	};

	const uploadToVps = async () => {
		const vpsUploadContinue = await confirmUpload();
		if (!vpsUploadContinue) return false;

		const imageUpload = await VpsService.uploadVpsImage(blob as File, dataURL);
		if (imageUpload.error && imageUpload.message) return Toast.error(imageUpload.message);
		if (imageUpload.data) value = imageUpload.data;
	};
</script>

<div style="--w: {width}px; --h: {height}px;" class="w1 flex start astart gap-medium container">
	<div class="w1 flex center acenter column gap-smaller overflow-horizontal">
		{#if blob}
			<p>Tamaño estimado archivo: {(blob.size / 1000).toFixed(2)} KB</p>
		{/if}
		<div class="w1 canvas-container relative">
			{#if !isEmpty && templateImage}
				<img
					class="template-image"
					src={templateImage}
					alt="template to know what the sizes should be"
				/>
			{/if}
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

			{#if name}
				<input type="hidden" {name} bind:value={dataURL} />
			{/if}
		</div>

		<div class="w1 button-container gap-5">
			<button type="button" class="btn danger icon" on:click={() => fab.clear()}>
				<Icon icon="trash" /> Borrar canvas
			</button>
			<button type="button" class="btn button icon cta" on:click={getFileFromCanvas}>
				<Icon icon="download" />
				Descargar
			</button>
			<button type="button" class="btn vps icon" on:click={uploadToVps}>
				<Icon icon="upload" /> Subir a VPS
			</button>
			<button type="button" class="btn imgur icon" on:click={uploadToImgur}>
				<Icon icon="upload" />
				Subir a Imgur
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
	.canvas-container .template-image {
		position: absolute;
		width: 100%;
		height: auto;
		opacity: 0.5;
		z-index: 0;
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
		border: 1px solid #ddd;
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
		grid-template-columns: repeat(2, 1fr);
	}
	.check-size {
		grid-column: span 2;
	}

	.btn.vps {
		background-color: var(--blue);
		color: #fff;
	}
</style>
