<script lang="ts">
	import { fabric } from 'fabric';
	import { onMount } from 'svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import editorUtils from '../editor.utils';
	import ResourceSelector from './resource-selector.svelte';
	export let templateImage = 'https://davidfernandezdeveloper.es/2k/images/cody-rhodes.webp';
	export let resourceList: { id: number; name: string; image: string }[] = [];
	let canvas: HTMLCanvasElement;
	let fabricCanvas: fabric.Canvas;
	let isCanvasEmpty = true;
	const canvaSize = 512;
	// export let data = { wrestlers: [] };

	const checkIfCanvasEmpty = () => {
		isCanvasEmpty = fabricCanvas.getObjects().length === 0;
	};

	onMount(() => {
		fabricCanvas = new fabric.Canvas(canvas, {
			width: canvaSize,
			height: canvaSize,
			backgroundColor: 'transparent'
		});

		fabricCanvas.on('object:added', checkIfCanvasEmpty);
		fabricCanvas.on('object:removed', checkIfCanvasEmpty);

		return () => {
			fabricCanvas.off('object:added', checkIfCanvasEmpty);
			fabricCanvas.off('object:removed', checkIfCanvasEmpty);
			fabricCanvas.dispose();
		};
	});

	function removeSelectedCanvaObject() {
		if (!fabric) return;
		const activeObject = fabricCanvas.getActiveObject();

		if (activeObject) {
			fabricCanvas.remove(activeObject);
			fabricCanvas.renderAll();
		}
	}

	function getStringFileFromCanvas() {
		if (fabricCanvas.isEmpty()) return '';
		fabricCanvas.discardActiveObject().renderAll();
		return canvas.toDataURL('image/webp');
	}

	async function addImageToCanvas(file: File) {
		const imageData = await editorUtils.readFile(file);

		fabricCanvas.add(
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
	}

	function addSingleImage(event: Event) {
		event.preventDefault();
		if (!event.target) return;
		const target = event.target as HTMLInputElement;
		if (!target.files) return;
		const file = target.files[0];

		addImageToCanvas(file);
	}

	function downloadImage() {
		const canvasDataURL = getStringFileFromCanvas();
		const link = document.createElement('a');
		link.download = 'image.webp';
		link.href = canvasDataURL;
		link.click();
	}

	function dropImage(event: DragEvent) {
		event.preventDefault();
		if (!event.dataTransfer) return;
		if (!event.dataTransfer.files) return;
		const file = event.dataTransfer.files[0];
		addImageToCanvas(file);
	}

	const preProcess = (formData: FormData) => {
		const dataUrl = getStringFileFromCanvas();
		formData.append('editor-image-data-resource', dataUrl);
		return true;
	};

	function clearAllCanvas() {
		fabricCanvas.clear();
	}
</script>

<AsyncForm method="post" action="upsertImage" buttonText="Guardar imagen" {preProcess}>
	<div class="w1 flex astart responsive gap-medium">
		<div class="whole-canvas-block-with-buttons">
			<div class="canvas-wrapper-container">
				{#if isCanvasEmpty}
					<div
						role="presentation"
						class="canvas-dropper"
						on:dragover|preventDefault
						on:drop|preventDefault={dropImage}
					></div>
				{/if}
				<img src={templateImage} alt="template to know what the sizes should be" />
				<canvas id="canvas" width={canvaSize} height={canvaSize} bind:this={canvas}></canvas>
			</div>
			<footer>
				<button type="button" class="btn">
					<label>
						<input type="file" accept="image/*" on:change={addSingleImage} />
						Upload
					</label>
				</button>

				<button type="button" class="btn" on:click={removeSelectedCanvaObject}>
					Remove selected
				</button>

				<button type="button" class="btn" on:click={clearAllCanvas}> Clear all </button>

				<button type="button" class="btn" on:click={downloadImage}> Download </button>
			</footer>
		</div>

		<div class="w1 resource-selector-container">
			<ResourceSelector list={resourceList} />
		</div>
	</div>

	<slot />
</AsyncForm>

<style>
	.canvas-wrapper-container {
		position: relative;
		width: 512px;
		height: 512px;
	}
	.canvas-wrapper-container .canvas-dropper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(rgba(0, 0, 0, 0.3), #000);
		z-index: 15;
	}
	.canvas-wrapper-container img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0.6;
		object-fit: cover;
	}
	canvas {
		border: 1px solid #000;
		background: transparent;
	}
	.btn {
		position: relative;
		background-color: #4caf50;
		border: none;
		color: white;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
	}

	.btn input[type='file'] {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		opacity: 0;
	}
</style>
