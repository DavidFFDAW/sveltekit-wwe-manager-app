<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import { Utils } from '$lib/utils/general.utils.js';
	import type { ChampionshipReign } from '@prisma/client';

	let { data } = $props();
	let upd = $state(data.upsert.upsertDatas);

	let date = $state(new Date(upd.date));
	let wrestlerList = $derived(data.upsert.wrestlers || []);
	let selectedWrestler = $derived(data.upsert.wrestlersMap?.get(upd.wrestler_id) || ({} as any));
	$inspect({
		upsert: data.upsert,
		upsertDatas: upd,
		selectedWrestler,
		wrestlerList,
		map: data.upsert.wrestlersMap,
		today: date
	});
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
							<input type="search" placeholder="Buscar por nombre, marca, división o estado..." />
						</label>
						<div class="filters">
							<button type="button" class="chip active">Todos</button>
							<button type="button" class="chip">Raw</button>
							<button type="button" class="chip">SmackDown</button>
							<button type="button" class="chip">NXT</button>
							<button type="button" class="chip">Activos</button>
							<button type="button" class="chip">Part-time</button>
						</div>
					</div>

					<div class="results-info">
						<span>Mostrando 124 luchadores disponibles</span>
						<span>1 seleccionado</span>
					</div>
					<div class="wrestler-list">
						<label class="wrestler-row">
							<input type="radio" name="wrestler_id" value="1" checked="" />
							<div class="wrestler-row-inner">
								<div class="avatar">
									<img src="https://placehold.co/120x120/dbeafe/1e3a8a?text=TS" alt="" />
								</div>

								<div class="wrestler-main">
									<strong>Tiffany Stratton</strong>
									<span>División femenina · Activa</span>
								</div>

								<div class="badges">
									<span class="badge smackdown">SmackDown</span>
									<span class="check">✓</span>
								</div>
							</div>
						</label>

						<label class="wrestler-row">
							<input type="radio" name="wrestler_id" value="2" />
							<div class="wrestler-row-inner">
								<div class="avatar">
									<img src="https://placehold.co/120x120/fce7f3/9d174d?text=RR" alt="" />
								</div>

								<div class="wrestler-main">
									<strong>Rhea Ripley</strong>
									<span>División femenina · Activa</span>
								</div>

								<div class="badges">
									<span class="badge raw">Raw</span>
									<span class="check">✓</span>
								</div>
							</div>
						</label>

						<label class="wrestler-row">
							<input type="radio" name="wrestler_id" value="3" />
							<div class="wrestler-row-inner">
								<div class="avatar">LK</div>

								<div class="wrestler-main">
									<strong>LA Knight</strong>
									<span>División masculina · Activo</span>
								</div>

								<div class="badges">
									<span class="badge smackdown">SmackDown</span>
									<span class="check">✓</span>
								</div>
							</div>
						</label>

						<label class="wrestler-row">
							<input type="radio" name="wrestler_id" value="4" />
							<div class="wrestler-row-inner">
								<div class="avatar">JU</div>

								<div class="wrestler-main">
									<strong>Jey Uso</strong>
									<span>División masculina · Activo</span>
								</div>

								<div class="badges">
									<span class="badge raw">Raw</span>
									<span class="check">✓</span>
								</div>
							</div>
						</label>

						<label class="wrestler-row">
							<input type="radio" name="wrestler_id" value="5" />
							<div class="wrestler-row-inner">
								<div class="avatar">CB</div>

								<div class="wrestler-main">
									<strong>Carmelo Hayes</strong>
									<span>División masculina · Activo</span>
								</div>

								<div class="badges">
									<span class="badge smackdown">SmackDown</span>
									<span class="check">✓</span>
								</div>
							</div>
						</label>
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

	@media only screen and (max-width: 768px) {
		.mitb-upsert-panels {
			grid-template-columns: 1fr;
		}
	}
</style>
