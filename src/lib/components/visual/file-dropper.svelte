<script lang="ts">
	import { droppableImages } from '$lib/actions/droppable.images';

	// FILE INPUT PROPS
	export let accept: string = '.json';
	export let name: string = 'file';
	export let classes: string = 'default-file-dropper-file-input';

	// PROPS FOR THE CORRECT BEHAVIOR OF COMPONENT
	let fileList: FileList;
	export let fileAction: (file: FileList) => void | Promise<void>;
	const onFileChange = (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLInputElement;
		if (!target.files) return;
		fileList = target.files;
		fileAction(target.files);
	};
	const onDropImage = (event: DragEvent) => {
		const files = event.dataTransfer?.files;
		if (!files || files.length === 0) return;
		fileList = files;
		fileAction(files);
	};
</script>

<div class="file-dropper-form-input relative">
	<input
		type="file"
		{accept}
		class="app-file {classes}"
		{name}
		on:change={onFileChange}
		use:droppableImages={onDropImage}
	/>
	{#if fileList && fileList.length > 0}
		<p>
			<i class="bi bi-file-earmark-text"></i>
			<span>File selected</span>
		</p>
	{/if}
</div>

<style>
	.file-dropper-form-input {
		width: 100%;
		min-height: 250px;
		border: 2px dashed #ccc;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.bi.bi-file-earmark-text {
		font-size: 1.5rem;
		margin-right: 5px;
	}
</style>
