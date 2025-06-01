<script lang="ts">
	import { HttpService } from '$lib/services/http.service';

	export let model: string;

	const downloadBackup = (event: MouseEvent) => {
		event.preventDefault();
		const timestamp = Date.now();

		HttpService.get(`/api/export/json/${model}`)
			.then((response) => {
				console.log({ response });
				const blob = new Blob([JSON.stringify(response.response)], { type: 'application/json' });
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `${model}_backup_${timestamp}.json`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
			})
			.catch((error) => {
				console.error('Error downloading backup:', error);
			});
	};
</script>

<div class="container">
	<a
		href="/api/export/json/{model}"
		class="button primary"
		target="_blank"
		on:click={downloadBackup}
	>
		Descargar {model}
	</a>
</div>
