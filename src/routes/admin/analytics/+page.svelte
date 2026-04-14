<script lang="ts">
	let { data } = $props();
	$inspect(data.metrics);
</script>

<div class="analytics-page">
	<header class="page-header">
		<h1>Analiticas del sitio</h1>
		<small>Consulta las métricas de tráfico y uso de la aplicación</small>
	</header>

	<section class="w1 down">
		<h2>Métricas recientes</h2>
		<div class="w1 analytics-metrics-list">
			{#each data.metrics as metric}
				<div class="w1 box flex column gap-smaller start astart" class:bot={metric.is_bot}>
					<div class="flex gap-smaller acenter">
						<strong>Evento</strong>
						<small class="text-muted">{metric.event}</small>
					</div>
					<div class="flex gap-smaller acenter">
						<strong>Página</strong>
						<small class="text-muted">{metric.page}</small>
					</div>
					<div class="flex gap-smaller acenter">
						<strong>Sistema operativo</strong>
						<small class="text-muted">{metric.os || 'N/A'}</small>
					</div>
					<div class="flex gap-smaller acenter">
						<strong>Navegador</strong>
						<small class="text-muted">{metric.browser || 'N/A'}</small>
					</div>
					<div class="flex gap-smaller acenter">
						<strong>Dispositivo</strong>
						<small class="text-muted">{metric.device || 'N/A'}</small>
					</div>
					{#if metric.is_bot}
						<div class="flex gap-smaller acenter">
							<strong>Bot</strong>
							<small class="text-muted">{metric.bot}</small>
						</div>
					{/if}
					<div class="flex gap-smaller acenter">
						<strong>Fecha</strong>
						<small class="text-muted">{metric.created_at?.toLocaleString()}</small>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>

<style>
	.analytics-metrics-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}
	.analytics-metrics-list .box {
		padding: 1rem;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		border: 1px solid #d0d0d0;
	}
	.analytics-metrics-list .box.bot {
		border-color: #ea9da5;
		box-shadow: none;
		border-width: 2px;
	}
</style>
