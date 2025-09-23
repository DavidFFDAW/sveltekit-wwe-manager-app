<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import FileDropper from '$lib/components/visual/file-dropper.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const handleFileChange = (files: FileList) => {
		console.log(files);
	};
</script>

<AsyncForm
	method="post"
	classes="w1"
	redirect="/admin/matchcards"
	showButtons={false}
	enctype="multipart/form-data"
>
	<FileDropper
		accept=".json"
		name="matchcard-event"
		classes="dropzone"
		fileAction={handleFileChange}
	/>
	<button type="submit" class="btn cta">Importar</button>
</AsyncForm>
