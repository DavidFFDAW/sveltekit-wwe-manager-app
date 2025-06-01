<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import ExportButton from './export-button.svelte';
</script>

<div class="container">
	<Box title="Exportar datos de aplicacion" icon="filetype-json" classes="astart">
		<div class="w1 title-container">
			<p>
				A continuación se mostrarán unos botones. Al pulsar sobre cada uno de ellos se descargará un
				<strong>JSON</strong> con los datos de la tabla concreta de la base de datos seleccionada.
			</p>
		</div>

		<div class="w1 grid gap-medium">
			<ExportButton model="championship" />
			<ExportButton model="Wrestler" />
		</div>
	</Box>
</div>

<style>
</style>
