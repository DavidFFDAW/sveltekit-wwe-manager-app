<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import { Utils } from '$lib/utils/general.utils.js';

	const maxItems = 50;
	let { data } = $props();
	let upd = $state(data.upsert.upsertDatas);
	let filters: Record<string, string> = $state({
		search: ''
	});

	let date = $state(new Date(upd.date));
	let wrestlerList = $derived(data.upsert.wrestlers || []);
	let filteredList = $derived.by(() => {
		if (!filters.search && !filters.brand && !filters.status)
			return wrestlerList.slice(0, maxItems);
		return wrestlerList
			.filter((wrestler) => {
				const searchMatch = filters.search
					? wrestler.name.toLowerCase().includes(filters.search.toLowerCase())
					: true;
				return searchMatch;
			})
			.slice(0, maxItems);
	});

	let selectedWrestler = $derived(data.upsert.wrestlersMap?.get(upd.wrestler_id) || ({} as any));
</script>

<section class="mitb-upsert-page">
	<header class="page-header">
		<span class="badge mitb-badge">Money In The Bank</span>
	</header>

	<AsyncForm
		method="post"
		showButtons={false}
		updateId={upd.id}
		classes="w1 form-upsert-mitb-reign"
	>
		<div class="mitb-upsert-panels">
			<div class="mitb-panel mitb-upsert-big-panel-content">
				<div class="section-title">
					<div class="number">1</div>
					<div>
						<h2>Ganador del combate</h2>
						<p>Listado compacto preparado para rosters largos.</p>
					</div>
				</div>

				<div class="mitb-selector-select-wrestler">
					<div class="mitb-selector-select-toolbar">
						<label class="search">
							<input
								type="search"
								placeholder="Buscar por nombre, marca, división o estado..."
								bind:value={filters.search}
							/>
						</label>
					</div>

					<div class="results-info">
						<span>Mostrando {filteredList.length} luchadores disponibles</span>
						{#if upd.wrestler_id}<span>1 seleccionado</span>{/if}
					</div>

					<div class="wrestler-list">
						{#each filteredList as wrestler}
							<label class="wrestler-row relative">
								<input
									type="radio"
									name="wrestler_id"
									class="app-radio"
									value={wrestler.id}
									bind:group={upd.wrestler_id}
								/>
								<div class="wrestler-row-inner inner wrestler-card">
									<div class="wrestler-card-inner">
										<img
											width="60"
											height="60"
											src={wrestler.image_name}
											alt=""
											class="wrestler-image"
											use:errorimage
										/>
										<div class="wrestler-main">
											<strong class="wrestler-name">{wrestler.name}</strong>
											<span class="division-text">
												División {wrestler.sex == 'm' ? 'masculina' : 'femenina'} · {wrestler.status}
											</span>
										</div>
									</div>
									<div class="wrestler-card-badges">
										<span class="badge brand-badge {wrestler.brand.toLowerCase()}">
											{wrestler.brand}
										</span>

										<span class="check-badge">✓</span>
									</div>
								</div>
							</label>
						{/each}
					</div>
				</div>
			</div>
			<div class="mitb-panel mitb-upsert-summary-panel">
				<div class="mitb-summary-hero"></div>
				<div class="mitb-summary-content">
					<div class="mitb-summary-row">
						<span class="mitb-summary-row-label">Fecha</span>
						<span class="mitb-summary-row-value">{Utils.formatDate(date)}</span>
					</div>

					<hr />

					<div class="mitb-summary-row">
						<span class="mitb-summary-row-label">Evento</span>
						<span class="mitb-summary-row-value">{upd.ppv}</span>
					</div>
				</div>
			</div>
		</div>
	</AsyncForm>
</section>

<style>
	:root {
		--yellow: #f4c84f;
		--dark: #151c2d;
	}
	.mitb-panel.mitb-upsert-big-panel-content {
		padding: 20px 15px;
	}
	.section-title {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		gap: 14px;
	}
	.section-title .number {
		width: 40px;
		height: 40px;
		border-radius: 14px;
		background: var(--dark);
		color: white;
		display: grid;
		place-items: center;
		font-weight: 900;
		flex: 0 0 40px;
	}
	.mitb-badge {
		background-color: #fff6dd;
		border: 3px solid #d8c9a1;
		margin: 1px;
		color: #8a6400;
		display: inline-block;
		text-align: center;
		font-size: 16px;
	}
	.mitb-upsert-panels {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 10px;
	}
	.mitb-upsert-panels .mitb-panel {
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		min-height: 300px;
		overflow: hidden;
	}

	.mitb-upsert-summary-panel {
		display: flex;
		flex-direction: column;
	}
	.mitb-upsert-summary-panel .mitb-summary-hero {
		width: 100%;
		min-height: 150px;
		padding: 25px;
		background:
			radial-gradient(circle at top right, rgba(244, 200, 79, 0.45), transparent 35%),
			linear-gradient(145deg, #151c2d, #0f172a);
	}

	.mitb-upsert-summary-panel .mitb-summary-content {
		display: flex;
		flex-direction: column;
		padding: 15px;
		gap: 10px;
	}
	.mitb-upsert-summary-panel .mitb-summary-content hr {
		margin: 0 -15px;
		width: calc(100% + 30px);
		border: 0;
	}

	.mitb-upsert-summary-panel .mitb-summary-content .mitb-summary-row .mitb-summary-row-label {
		display: block;
		font-weight: bold;
		text-transform: uppercase;
	}

	.wrestler-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.wrestler-row-inner.wrestler-card {
		border: 1px solid #ccc;
		background-color: #fff;
		border-radius: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		gap: 10px;
	}
	.wrestler-row-inner.wrestler-card img.wrestler-image {
		width: 60px;
		height: 60px;
		aspect-ratio: 1/1;
		object-fit: cover;
		border: 1px solid #0f172a;
		border-radius: 0.5rem;
	}

	.wrestler-card-badges {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.wrestler-card-badges .check-badge {
		display: none;
		width: 25px;
		height: 25px;
		color: var(--dark);
		background-color: var(--yellow);
		font-weight: bold;
		text-align: center;
		line-height: 25px;
		border-radius: 50%;
	}

	label.wrestler-row input[type='radio']:checked + .wrestler-row-inner.wrestler-card .check-badge {
		display: inline-block;
	}

	.wrestler-card .brand-badge {
		padding: 5px 8px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 900;
		background: #eef2ff;
		color: #3730a3;
		text-transform: capitalize;
	}
	.wrestler-card .brand-badge.raw {
		background: #fee2e2;
		color: #991b1b;
	}

	.wrestler-card .brand-badge.smackdown {
		background: #dbeafe;
		color: #1d4ed8;
	}

	.wrestler-card .brand-badge.awl,
	.wrestler-card .brand-badge.evolution {
		background: #fef3c7;
		color: #92400e;
	}

	@media only screen and (max-width: 900px) {
		.mitb-upsert-panels {
			grid-template-columns: 1fr;
		}
	}
</style>
