<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';

	type Injury = {
		id: number;
		injury: string;
		start: string;
		end: string;
		isPast: boolean;
		isCurrent: boolean;
		statusLabel: string;
		severityLabel: string;
		durationLabel: string;
		postLabel: string;
		post_id?: number | null;
		Wrestler: {
			id: number;
			name: string;
			image_name?: string | null;
		};
	};

	let { data }: { data: { injuries: Injury[] } } = $props();

	let injuries = $derived(data.injuries || []);
	let currentInjuries = $derived(injuries.filter((injury) => injury.isCurrent).length);
</script>

<div class="injuries-page">
	<header class="page-header injuries-header">
		<div>
			<span class="eyebrow">Gestion medica</span>
			<h1>Lesiones</h1>
			<p>Control de bajas activas e historial de lesiones registradas.</p>
		</div>

		<div class="injury-summary">
			<div>
				<strong>{currentInjuries}</strong>
				<span>Actuales</span>
			</div>
			<div>
				<strong>{injuries.length - currentInjuries}</strong>
				<span>Pasadas</span>
			</div>
		</div>
	</header>

	{#if injuries.length > 0}
		<div class="injuries-grid">
			{#each injuries as injury}
				<article
					class="injury-card"
					class:is-current={injury.isCurrent}
					class:is-past={injury.isPast}
				>
					<div class="card-status-line"></div>

					<header class="card-header">
						<div class="wrestler-avatar">
							<img
								src={injury.Wrestler.image_name}
								alt={injury.Wrestler.name}
								use:errorimage={'/vacant.webp'}
							/>
						</div>

						<div class="card-title">
							<span class="status-pill" class:current={injury.isCurrent} class:past={injury.isPast}>
								<i
									class="bi"
									class:bi-heart-pulse={injury.isCurrent}
									class:bi-check2-circle={injury.isPast}
								></i>
								{injury.statusLabel}
							</span>
							<h2>{injury.Wrestler.name}</h2>
						</div>
					</header>

					<div class="injury-body">
						<div class="injury-name">
							<span>Lesion</span>
							<strong>{injury.injury}</strong>
						</div>

						<div class="injury-meta-grid">
							<div class="meta-item">
								<span>Severidad</span>
								<strong>{injury.severityLabel}</strong>
							</div>

							<div class="meta-item">
								<span>Duracion</span>
								<strong>{injury.durationLabel}</strong>
							</div>

							<div class="meta-item">
								<span>Inicio</span>
								<strong>{injury.start}</strong>
							</div>

							<div class="meta-item">
								<span>Fin</span>
								<strong>{injury.end}</strong>
							</div>
						</div>
					</div>

					<footer class="card-footer">
						<div class="post-pill" class:linked={injury.post_id} class:unlinked={!injury.post_id}>
							<i
								class="bi"
								class:bi-file-earmark-text={injury.post_id}
								class:bi-file-earmark-x={!injury.post_id}
							></i>
							<span>{injury.postLabel}</span>
						</div>

						<a
							class="edit-button"
							aria-label={`Editar lesion de ${injury.Wrestler.name}`}
							href={`/admin/injuries/upsert?id=${injury.id}`}
						>
							<i class="bi bi-pencil"></i>
						</a>
					</footer>
				</article>
			{/each}
		</div>
	{:else}
		<section class="empty-state">
			<i class="bi bi-heart-pulse"></i>
			<h2>No hay lesiones registradas</h2>
			<p>Cuando se cree una lesion aparecera aqui como tarjeta del historial medico.</p>
		</section>
	{/if}

	<ButtonCreate endpoint="/injuries/upsert" />
</div>

<style>
	.injuries-page {
		max-width: 1240px;
		margin: 0 auto;
		padding: 0 20px 50px;
		color: #172033;
	}

	.injuries-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 24px;
		margin-bottom: 24px;
	}

	.injuries-header h1 {
		margin: 12px 0 8px;
		font-size: clamp(30px, 4vw, 42px);
		line-height: 1.05;
	}

	.injuries-header p {
		margin: 0;
		color: #728096;
		line-height: 1.55;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		padding: 7px 12px;
		border-radius: 999px;
		background: #fef2f2;
		color: #b91c1c;
		font-size: 12px;
		font-weight: 900;
		text-transform: uppercase;
	}

	.injury-summary {
		display: grid;
		grid-template-columns: repeat(2, minmax(96px, 1fr));
		gap: 10px;
		min-width: 230px;
	}

	.injury-summary div {
		padding: 14px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
	}

	.injury-summary strong {
		display: block;
		font-size: 24px;
		line-height: 1;
	}

	.injury-summary span {
		display: block;
		margin-top: 5px;
		color: #728096;
		font-size: 12px;
		font-weight: 800;
		text-transform: uppercase;
	}

	.injuries-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 18px;
		align-items: stretch;
	}

	.injury-card {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 100%;
		overflow: hidden;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			border-color 0.15s ease;
	}

	.injury-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 22px 55px rgba(15, 23, 42, 0.12);
	}

	.card-status-line {
		height: 5px;
		background: #94a3b8;
	}

	.injury-card.is-current {
		border-color: #fecaca;
	}

	.injury-card.is-current .card-status-line {
		background: linear-gradient(90deg, #dc2626, #fb7185);
	}

	.injury-card.is-past .card-status-line {
		background: linear-gradient(90deg, #16a34a, #22c55e);
	}

	.card-header {
		display: grid;
		grid-template-columns: 74px minmax(0, 1fr);
		gap: 14px;
		align-items: center;
		padding: 18px 18px 14px;
	}

	.wrestler-avatar {
		width: 74px;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 8px;
		background: #e5e7eb;
	}

	.wrestler-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.card-title {
		min-width: 0;
	}

	.card-title h2 {
		margin: 8px 0 0;
		font-size: 21px;
		line-height: 1.15;
		overflow-wrap: anywhere;
	}

	.status-pill,
	.post-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		width: fit-content;
		max-width: 100%;
		padding: 6px 9px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 900;
		line-height: 1;
	}

	.status-pill.current {
		color: #991b1b;
		background: #fee2e2;
	}

	.status-pill.past {
		color: #166534;
		background: #dcfce7;
	}

	.injury-body {
		display: grid;
		gap: 16px;
		padding: 0 18px 18px;
		flex: 1;
	}

	.injury-name {
		padding: 14px;
		border-radius: 8px;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
	}

	.injury-name span,
	.meta-item span {
		display: block;
		margin-bottom: 5px;
		color: #728096;
		font-size: 12px;
		font-weight: 800;
		text-transform: uppercase;
	}

	.injury-name strong {
		display: block;
		font-size: 16px;
		line-height: 1.3;
		overflow-wrap: anywhere;
	}

	.injury-meta-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.meta-item {
		min-width: 0;
		padding: 12px;
		border-radius: 8px;
		background: #fff;
		border: 1px solid #e2e8f0;
	}

	.meta-item strong {
		display: block;
		font-size: 13px;
		line-height: 1.25;
		overflow-wrap: anywhere;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 14px 18px 18px;
		border-top: 1px solid #e2e8f0;
		background: #fafafa;
	}

	.post-pill.linked {
		color: #5b21b6;
		background: #ede9fe;
	}

	.post-pill.unlinked {
		color: #475569;
		background: #e2e8f0;
	}

	.edit-button {
		width: 38px;
		height: 38px;
		display: grid;
		place-items: center;
		flex: 0 0 38px;
		border-radius: 8px;
		background: #111827;
		color: white;
		text-decoration: none;
		transition:
			background 0.15s ease,
			transform 0.15s ease;
	}

	.edit-button:hover {
		background: #dc2626;
		transform: translateY(-1px);
	}

	.empty-state {
		display: grid;
		place-items: center;
		text-align: center;
		gap: 10px;
		min-height: 260px;
		padding: 34px 18px;
		border: 1px dashed #cbd5e1;
		border-radius: 8px;
		background: #fff;
	}

	.empty-state i {
		font-size: 42px;
		color: #dc2626;
	}

	.empty-state h2 {
		margin: 0;
	}

	.empty-state p {
		margin: 0;
		color: #728096;
	}

	@media (max-width: 800px) {
		.injuries-page {
			padding: 0 12px 40px;
		}

		.injuries-header {
			flex-direction: column;
		}

		.injury-summary {
			width: 100%;
		}
	}

	@media (max-width: 420px) {
		.injuries-grid {
			grid-template-columns: 1fr;
		}

		.card-header {
			grid-template-columns: 60px minmax(0, 1fr);
			padding: 16px 16px 12px;
		}

		.wrestler-avatar {
			width: 60px;
		}

		.injury-body,
		.card-footer {
			padding-left: 16px;
			padding-right: 16px;
		}
	}
</style>
