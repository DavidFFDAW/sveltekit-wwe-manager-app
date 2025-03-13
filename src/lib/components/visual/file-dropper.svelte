<script lang="ts">
	import { droppableImages } from '$lib/actions/droppable.images';

	// FILE INPUT PROPS
	export let accept: string = '.json';
	export let name: string = 'file';
	export let classes: string = 'default-file-dropper-file-input';

	// PROPS FOR THE CORRECT BEHAVIOR OF COMPONENT
	let hasFile: boolean = false;
	export let fileAction: (file: FileList) => void | Promise<void>;
	const onFileChange = (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLInputElement;
		if (!target.files) return;
		hasFile = target.files.length > 0;
		fileAction(target.files);
	};
	const onDropImage = (event: DragEvent) => {
		const files = event.dataTransfer?.files;
		if (!files || files.length === 0) return;
		hasFile = files.length > 0;
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
	{#if hasFile}
		<p>
			<i class="bi bi-file-earmark-text"></i>
			<span>File selected</span>
		</p>
	{/if}
</div>
