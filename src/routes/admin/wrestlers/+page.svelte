<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import ActionsAsync from '$lib/components/buttons/grouped-actions/actions-async.svelte';
	import ActionsCsv from '$lib/components/buttons/grouped-actions/actions-csv.svelte';
	import ActionsLink from '$lib/components/buttons/grouped-actions/actions-link.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import Pagination from '$lib/components/visual/pagination.svelte';
	import { WrestlerConstants } from '$lib/constants/wrestler.constants.js';
	import SingleWrestlerCard from './single-wrestler-card.svelte';

	let { data } = $props();
	const activeFilters = $derived(
		[
			{ name: 'search', value: data.filters.search, label: `Nombre: ${data.filters.search}` },
			{
				name: 'gender',
				value: data.filters.sex,
				label:
					WrestlerConstants.genders.find((item) => item.value === data.filters.sex)?.label ?? ''
			},
			{
				name: 'status',
				value: data.filters.status,
				label: WrestlerConstants.statusDict[data.filters.status] ?? ''
			}
		].filter((filter) => filter.value)
	);

	function removeFilter(name: string) {
		const params = new URLSearchParams();
		for (const filter of activeFilters) {
			if (filter.name !== name) params.set(filter.name, filter.value);
		}
		const query = params.toString();
		return `/admin/wrestlers${query ? `?${query}` : ''}`;
	}
</script>

<div class="admin-page-wrapper admin-wrestlers">
	<div class="w1 flex end">
		<GroupedActions text="Acciones de luchadores" position="right">
			<ActionsLink href="/admin/wrestlers/create" icon="plus" color="success">
				Crear luchador
			</ActionsLink>

			<ActionsLink href="/admin/wrestlers/fire-hire" icon="person-x" color="info">
				Contratar/Despedir luchadores
			</ActionsLink>

			<ActionsLink href="/admin/wrestlers/genders" icon="gender-trans" color="info">
				Gestionar géneros de luchadores
			</ActionsLink>

			<ActionsLink href="/admin/wrestlers/brands" icon="tags" color="info">
				Gestionar marcas de luchadores
			</ActionsLink>

			<ActionsLink
				href="https://davidfernandezdeveloper.es/2k/api/v2/images/zip"
				icon="file-earmark-zip"
				color="success"
			>
				Descargar Zip de imágenes
			</ActionsLink>
			<ActionsLink href="/admin/wrestlers/bulk/update/status" icon="pencil-square" color="info">
				Actualizar estados masivamente
			</ActionsLink>
			<ActionsCsv
				href="/api/export/csv/wrestlers?separator=;"
				downloadName="wrestlers-{Date.now()}.csv"
				icon="file-earmark-arrow-down"
			>
				Exportar CSV
			</ActionsCsv>
			<ActionsAsync href="/api/wrestler/slug/refresh" method="post" icon="arrow-clockwise">
				Regenerar slugs de luchadores
			</ActionsAsync>
		</GroupedActions>
	</div>

	<section class="filters-panel" aria-labelledby="filters-title">
		<div class="filters-heading">
			<h2 id="filters-title">
				<i class="bi bi-sliders" aria-hidden="true"></i> Filtrar luchadores
			</h2>
			{#if activeFilters.length > 0}<a href="/admin/wrestlers" class="clear-filters"
					>Limpiar filtros</a
				>{/if}
		</div>
		{#key JSON.stringify(data.filters)}
			<form
				action="/admin/wrestlers"
				method="get"
				class="filters-form"
				role="search"
				aria-label="Buscar luchadores"
			>
				<label class="filter-field search-field">
					<span>Nombre</span>
					<input
						type="search"
						name="search"
						value={data.filters.search}
						placeholder="Buscar por nombre..."
						maxlength="255"
					/>
				</label>
				<label class="filter-field">
					<span>Género</span>
					<select name="gender" value={data.filters.sex}>
						<option value="">Todos los géneros</option>
						{#each WrestlerConstants.genders as option}<option value={option.value}
								>{option.label}</option
							>{/each}
					</select>
				</label>
				<label class="filter-field">
					<span>Estado</span>
					<select name="status" value={data.filters.status}>
						<option value="">Todos los estados</option>
						{#each WrestlerConstants.statuses as option}<option value={option.value}
								>{option.label}</option
							>{/each}
					</select>
				</label>
				<button type="submit" class="apply-filters"
					><i class="bi bi-search" aria-hidden="true"></i> Aplicar filtros</button
				>
			</form>
		{/key}

		{#if activeFilters.length > 0}
			<div class="active-filters" aria-label="Filtros aplicados">
				<span>Aplicados:</span>
				{#each activeFilters as filter (filter.name)}
					<a
						href={removeFilter(filter.name)}
						class="filter-chip"
						aria-label="Quitar filtro: {filter.label}"
						>{filter.label}<i class="bi bi-x-lg" aria-hidden="true"></i></a
					>
				{/each}
			</div>
		{/if}
	</section>

	<div class="results-toolbar">
		<div>
			<h1 class="uppercase">Wrestlers</h1>
			<p class="results-count">
				{data.total}
				{data.total === 1 ? 'luchador encontrado' : 'luchadores encontrados'}
			</p>
		</div>
	</div>

	{#if data.wrestlers.length > 0}
		<div class="results-footer">
			<p class="results-count">
				Mostrando {(data.page - 1) * 10 + 1}–{Math.min(data.page * 10, data.total)} de {data.total}
			</p>
			<Pagination total={data.total} itemsPerPage={10} bind:currentPage={data.page} />
		</div>
		<ul class="wrestlers-grid" aria-label="Luchadores">
			{#each data.wrestlers as wrestler (wrestler.id)}
				<li><SingleWrestlerCard {wrestler} /></li>
			{/each}
		</ul>
	{:else}
		<div class="empty-state">
			<i class="bi bi-search" aria-hidden="true"></i>
			<h2>No se han encontrado luchadores</h2>
			<p>Prueba otro nombre o cambia los filtros.</p>
			<a href="/admin/wrestlers" class="btn secondary">Limpiar filtros</a>
		</div>
	{/if}

	<ButtonCreate endpoint="wrestlers/create" />
</div>

<style>
	.filters-panel {
		width: 100%;
		padding: 1.25rem;
		border: 1px solid var(--border, #e0e4e9);
		border-radius: 12px;
		background: var(--surface, #fff);
		color: var(--text, #252b36);
	}
	.filters-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}
	.filters-heading h2 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1rem;
		margin: 0;
	}
	.clear-filters {
		font-size: 0.85rem;
		text-decoration: underline;
		text-underline-offset: 3px;
		padding: 0.4rem 0;
	}
	.filters-form {
		display: grid;
		grid-template-columns: minmax(180px, 2fr) repeat(2, minmax(140px, 1fr)) auto;
		align-items: end;
		gap: 0.85rem;
	}
	.filter-field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		min-width: 0;
		font-size: 0.85rem;
		font-weight: 600;
	}
	.filter-field input,
	.filter-field select {
		width: 100%;
		min-width: 0;
		height: 44px;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--border, #cbd2dc);
		border-radius: 7px;
		background: var(--surface, #fff);
		color: var(--text, #252b36);
		font: inherit;
		font-weight: 400;
	}
	.filter-field input::placeholder {
		color: var(--muted, #646b78);
	}
	.apply-filters {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 44px;
		padding: 0.6rem 1rem;
		border: 1px solid #17181c;
		border-radius: 7px;
		background: #17181c;
		color: #fff;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}
	.apply-filters:hover {
		background: #343842;
	}
	.filters-panel :is(input, select, button, a):focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 3px;
	}
	.active-filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border, #e0e4e9);
		font-size: 0.8rem;
	}
	.active-filters > span {
		color: var(--muted, #646b78);
	}
	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.7rem;
		min-height: 36px;
		max-width: 100%;
		overflow-wrap: anywhere;
		background: var(--surface2, #f0f3f7);
		border: 1px solid var(--border, #dce0e6);
		border-radius: 6px;
	}
	.filter-chip:hover {
		border-color: var(--muted, #646b78);
	}
	.filter-chip i {
		flex-shrink: 0;
	}
	@media (max-width: 1000px) {
		.filters-form {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.search-field {
			grid-column: 1 / -1;
		}
		.apply-filters {
			grid-column: 1 / -1;
		}
	}
	@media (max-width: 480px) {
		.filters-panel {
			padding: 1rem;
		}
		.filters-form {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	.results-toolbar,
	.results-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		width: 100%;
	}
	.results-toolbar {
		margin: 2rem 0 1rem;
	}
	.results-toolbar h1 {
		margin: 0;
	}
	.results-count {
		color: var(--muted, #646b78);
		font-size: 0.9rem;
		margin: 0.25rem 0;
	}
	.wrestlers-grid {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
		gap: 1rem;
		padding: 0;
		margin: 0 0 1rem;
		list-style: none;
	}
	.wrestlers-grid li {
		min-width: 0;
	}
	.results-footer {
		margin-bottom: 2rem;
	}
	.empty-state {
		width: 100%;
		padding: 3rem 1rem;
		text-align: center;
		background: var(--surface, #fff);
		border: 1px dashed var(--border, #dce0e6);
		border-radius: 12px;
	}
	.empty-state > i {
		font-size: 2rem;
		color: var(--muted, #646b78);
	}
	.empty-state p {
		margin: 0.5rem 0 1.5rem;
	}
</style>
