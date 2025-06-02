<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	export let data;
</script>

<div class="w1 flex column gap">
	<Box title="Exportar estructura de base de datos" icon="filetype-sql" classes="astart">
		<div class="w1 title-container">
			<p>
				A continuación se mostrarán unos botones. Al pulsar sobre cada uno de ellos se descargará un
				<strong>SQL</strong> con los datos de la tabla concreta de la base de datos seleccionada.
			</p>
		</div>

		<div class="w1 grid gap-medium">
			<a href="/api/export/database/all" target="_blank" download>Descargar todas</a>
			<a href="/api/export/database/table/wrestler" target="_blank" download>Descargar Wrestlers</a>
		</div>
	</Box>

	<Box title="Exportar datos de base de datos" icon="filetype-sql" classes="astart">
		<div class="w1 title-container">
			<p>
				A continuación se mostrarán unos botones. Al pulsar sobre cada uno de ellos se descargará un
				<strong>SQL</strong> con los datos de la tabla concreta de la base de datos seleccionada.
			</p>
		</div>

		<div class="w1 grid buttons-grid gap-smaller">
			{#each data.models as model}
				<a
					href="/api/export/sql/table/{model}"
					class="btn icon btn-download"
					target="_blank"
					download
				>
					<i class="bi bi-database"></i>
					<span>Descargar {model}</span>
				</a>
			{/each}
		</div>
	</Box>
</div>

<style>
	.grid.buttons-grid {
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}
</style>
