<script lang="ts">
	import { HttpService } from '$lib/services/http.service';
	import Icon from '../icons/icon.svelte';

	export let href: string;
	export let downloadName: string;
	export let label: string = 'Exportar CSV';
	export let classes: string = 'default-export-button';
	export let separator: string = ',';

	const downloadCsv = async (event: MouseEvent) => {
		event.preventDefault();
		const link = event.target as HTMLAnchorElement;
		const url = link.getAttribute('href');
		if (!url) return;

		const response = await HttpService.get(`${url}?separator=${separator}`);
		const csvContent = response.response.csv;
		if (!csvContent) return;

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const urlBlob = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = urlBlob;
		a.download = downloadName;
		a.click();

		URL.revokeObjectURL(urlBlob);
		a.remove();
	};
</script>

<a
	{href}
	download={downloadName}
	class="btn icon export export-btn-link {classes}"
	data-separator={separator}
	on:click={downloadCsv}
>
	<Icon icon="file-earmark-arrow-down" />
	{label}
</a>
