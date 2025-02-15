<script lang="ts">
	import { onMount } from 'svelte';
	import { fabric } from 'fabric';
	import editorUtils from '../../image-editor/editor.utils';
	import { Toast } from '$lib/utils/toast.helper';

	const width = 800;
	const height = 450;
	let imageQuality = 0.7;
	let imageType = 'image/jpeg';
	let canvas: HTMLCanvasElement;
	let fab: fabric.Canvas;
	let blob: Blob | null;
	let isEmpty: boolean = true;

	const checkIfCanvasEmpty = () => {
		isEmpty = fab.getObjects().length === 0;
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

	const addImage = async (event: Event) => {
		fab.clear();
		if (!fab.isEmpty()) return Toast.error('No puedes añadir más de una imagen.');

		const target = event.target as HTMLInputElement;
		if (!target.files) return;
		const pfile = target.files[0];
		console.log({ pfile });

		const imageData = await editorUtils.readFile(pfile);
		console.log({ imageData });

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

	const checkBlob = () => {
		canvas.toBlob(
			(genblob) => {
				blob = genblob;
			},
			imageType,
			imageQuality
		);
	};
</script>

<div style="--w: {width}px; --h: {height}px;" class="flex center container">
	<div class="canvas-container">
		{#if blob}
			<p>Tamaño estimado archivo: {(blob.size / 1000).toFixed(2)} KB</p>
		{/if}
		<canvas bind:this={canvas} {width} {height}></canvas>
	</div>
	<div class="w1 inputs flex column gap-smaller">
		<input type="file" accept="image/*" on:change={addImage} />
		<input type="number" bind:value={imageQuality} step="0.1" min="0.1" max="1" />
		<input type="text" bind:value={imageType} placeholder="image/jpeg" />

		<div class="w1 button-container flex between acenter gap-medium">
			<button type="button" class="btn button cta" on:click={getFileFromCanvas}>Download</button>
			<button type="button" class="btn button cta" on:click={checkBlob}>Check size</button>
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		min-height: 100vh;
		padding: 1rem;
		align-items: flex-start;
	}
	.canvas-container {
		width: var(--w);
	}
	canvas {
		width: 100%;
		height: var(--h);
		background-color: transparent;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		overflow: hidden;
	}
</style>
