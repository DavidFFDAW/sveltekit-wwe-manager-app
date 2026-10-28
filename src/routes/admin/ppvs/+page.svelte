<script lang="ts">
	import ActionsAsync from '$lib/components/buttons/grouped-actions/actions-async.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import LoadButton from '$lib/components/buttons/load-button.svelte';
	import PpvList from './ppv-list.svelte';

	let { data } = $props();
	const filterOptions = [
		{ value: 'all', label: 'Todos los PPVs' },
		{ value: 'active', label: 'Activos' },
		{ value: 'inactive', label: 'Inactivos' },
		{ value: 'no-date', label: 'Sin fecha asignada' },
		{ value: 'to-be-announced', label: 'Por anunciar' }
	];
	const datedCount = $derived(data.ppvs.filter((ppv) => ppv.game_date).length);
	const filterLabel = $derived(
		filterOptions.find((option) => option.value === data.filters.type)?.label
	);
</script>

<div class="ppv-panel">
	<header class="panel-header">
		<div>
			<p class="eyebrow">Eventos</p>
			<h1>PPVs</h1>
			<p class="subtitle">Organiza los eventos, sus fechas y sus sedes.</p>
		</div>
		<div class="header-actions">
			<a class="panel-button secondary" href="/admin/ppvs/update/calendar"
				><i class="bi bi-calendar3" aria-hidden="true"></i> Gestionar calendario</a
			>
			<a class="panel-button primary" href="/admin/ppvs/create"
				><i class="bi bi-plus-lg" aria-hidden="true"></i> Crear PPV</a
			>
		</div>
	</header>

	<section class="filter-panel" aria-label="Filtrar PPVs">
		{#key JSON.stringify(data.filters)}
			<form method="get" action="/admin/ppvs" role="search" aria-label="Buscar PPVs">
				<label class="search-field"
					><span>Buscar evento</span><input
						type="search"
						name="search"
						placeholder="Nombre del PPV…"
						maxlength="255"
						value={data.filters.search}
					/></label
				>
				<label
					><span>Mostrar</span><select name="type" value={data.filters.type}
						>{#each filterOptions as option}<option value={option.value}>{option.label}</option
							>{/each}</select
					></label
				>
				<button type="submit" class="panel-button primary"
					><i class="bi bi-search" aria-hidden="true"></i> Buscar</button
				>
				{#if data.filters.search || data.filters.type !== 'all'}<a
						href="/admin/ppvs?type=all"
						class="clear-filters">Ver todos</a
					>{/if}
			</form>
		{/key}
	</section>

	<div class="results-heading">
		<div>
			<h2>{filterLabel} <span class="count">{data.ppvs.length}</span></h2>
			<p class="subtitle">
				{datedCount} con fecha · {data.ppvs.length - datedCount} sin fecha{#if data.filters.search}
					· Búsqueda: «{data.filters.search}»{/if}
			</p>
		</div>

		<LoadButton href="/admin/ppvs/dates" method="post" icon="calendar2-week" color="warn">
			Mover activos a domingos de {data.targetYear}
		</LoadButton>
	</div>

	{#if data.ppvs.length}
		<PpvList ppvs={data.ppvs} />
	{:else}
		<div class="empty-state">
			<i class="bi bi-calendar-x" aria-hidden="true"></i>
			<h2>No hay PPVs con estos filtros</h2>
			<p>Prueba otro nombre o consulta todos los eventos.</p>
			<a class="panel-button secondary" href="/admin/ppvs?type=all">Ver todos los PPVs</a>
		</div>
	{/if}
</div>

<style>
	.ppv-panel {
		width: 100%;
		max-width: 1600px;
		margin: 0 auto;
		padding-bottom: 2rem;
		color: var(--text, #252b36);
	}
	.panel-header,
	.header-actions,
	.results-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.panel-header {
		margin-bottom: 1.75rem;
	}
	.header-actions {
		justify-content: flex-start;
		gap: 0.65rem;
	}
	.eyebrow {
		color: var(--muted, #687384);
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		margin-bottom: 0.4rem;
	}
	h1 {
		font-size: 2.25rem;
		margin: 0 0 0.4rem;
	}
	.subtitle {
		color: var(--muted, #687384);
		font-size: 0.9rem;
		line-height: 1.5;
		overflow-wrap: anywhere;
	}
	.panel-button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 0.55rem;
		min-height: 44px;
		padding: 0.65rem 1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 600;
		border: 1px solid transparent;
		cursor: pointer;
	}
	.primary {
		background: #c91727;
		color: #fff;
	}
	.primary:hover {
		background: #a61120;
	}
	.secondary {
		background: var(--surface, #fff);
		border-color: var(--border, #dce0e6);
	}
	.secondary:hover {
		background: var(--surface2, #f0f3f7);
	}
	.filter-panel {
		background: var(--surface, #fff);
		border: 1px solid var(--border, #e0e4e9);
		border-radius: 12px;
		padding: 1.25rem;
	}
	form {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		gap: 0.85rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		flex: 1 1 180px;
		font-size: 0.8rem;
		font-weight: 600;
		min-width: 0;
	}
	.search-field {
		flex: 3 1 260px;
	}
	input,
	select {
		width: 100%;
		height: 44px;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--border, #cbd2dc);
		border-radius: 7px;
		background: var(--surface, #fff);
		color: inherit;
		font-size: 0.9rem;
	}
	input::placeholder {
		color: var(--muted, #687384);
	}
	.clear-filters {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-size: 0.85rem;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.results-heading {
		margin: 1.75rem 0 1rem;
	}
	.results-heading h2 {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 1.1rem;
		margin-bottom: 0.3rem;
	}
	.count {
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
		background: var(--surface2, #e8ebf0);
		font-size: 0.8rem;
		font-variant-numeric: tabular-nums;
	}
	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		border: 1px dashed var(--border, #cbd2dc);
		border-radius: 12px;
		background: var(--surface, #fff);
	}
	.empty-state > i {
		font-size: 2rem;
		color: var(--muted, #687384);
	}
	.empty-state h2 {
		font-size: 1.2rem;
		margin: 1rem 0 0.5rem;
	}
	.empty-state p {
		margin-bottom: 1.5rem;
		color: var(--muted, #687384);
	}
	a:focus-visible,
	button:focus-visible,
	input:focus-visible,
	select:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 3px;
	}
	@media (max-width: 600px) {
		.header-actions {
			width: 100%;
		}
		.header-actions a {
			flex: 1 1 180px;
		}
		form > button {
			flex: 1;
		}
		.filter-panel {
			padding: 1rem;
		}
	}
</style>
