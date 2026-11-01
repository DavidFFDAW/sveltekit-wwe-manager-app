<script lang="ts">
	import { enhance } from '$app/forms';
	import { errorimage } from '$lib/actions/error.image.js';
	let { data } = $props();

	function checkConfirmation(event: Event) {
		if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) event.preventDefault();
	}
</script>

<div class="matchcards-page">
	<header class="page-header">
		<div>
			<h1>Cartelera de eventos</h1>
			<p>Gestiona los combates, las valoraciones y los resúmenes de tus eventos.</p>
		</div>
		<a class="create-event" href="/admin/matchcards/event"
			><i class="bi bi-plus-lg" aria-hidden="true"></i> Crear evento</a
		>
	</header>

	<nav class="year-filters" aria-label="Filtrar eventos por año">
		{#each data.uniqueYears as year}
			<a
				href="?year={year}"
				class:active={data.selectedYear === year}
				aria-current={data.selectedYear === year ? 'page' : undefined}>{year}</a
			>
		{/each}
	</nav>

	<section aria-labelledby="events-heading">
		<div class="section-heading">
			<h2 id="events-heading">Eventos de {data.selectedYear}</h2>
			<span>{data.matchcards.length} {data.matchcards.length === 1 ? 'evento' : 'eventos'}</span>
		</div>
		<div class="event-grid">
			{#each data.matchcards as matchcard (matchcard.id)}
				<article class="event-card" aria-labelledby="event-{matchcard.id}">
					<div class="event-artwork">
						<img
							src={matchcard.ppv_image}
							use:errorimage={data.statics.noimage}
							alt={matchcard.ppv_name}
							loading="lazy"
							draggable="false"
						/>
					</div>
					<div class="event-content">
						<p class="event-date">
							<i class="bi bi-calendar3" aria-hidden="true"></i>
							{matchcard.formatted_date}
						</p>
						<div class="event-title">
							<h3 id="event-{matchcard.id}">{matchcard.ppv_name}</h3>
							<span class="rating" aria-label="Valoración media: {matchcard.average}"
								><i class="bi bi-star-fill" aria-hidden="true"></i> {matchcard.average}</span
							>
						</div>
						<div class="event-stats">
							<span
								><strong>{matchcard.matches}</strong>
								{matchcard.matches === 1 ? 'combate' : 'combates'}</span
							>
							<span
								><strong>{matchcard.nights}</strong>
								{matchcard.nights === 1 ? 'noche' : 'noches'}</span
							>
						</div>
					</div>
					<footer class="event-actions">
						<div class="primary-actions">
							<a
								class="matches-link"
								href="/admin/matchcards/matches/upsert-matches?slug={matchcard.id}"
								><i class="bi bi-pencil" aria-hidden="true"></i> Combates</a
							>
							<a href="/admin/matchcards/rating?slug={matchcard.id}"
								><i class="bi bi-star" aria-hidden="true"></i> Valoraciones</a
							>
						</div>
						<details class="more-actions">
							<summary
								><span>Más opciones</span><i class="bi bi-chevron-down" aria-hidden="true"></i><span
									class="sr-only"
								>
									para {matchcard.ppv_name}</span
								></summary
							>
							<div class="secondary-actions">
								<a href="/admin/matchcards/event?slug={matchcard.id}"
									><i class="bi bi-pencil-square" aria-hidden="true"></i> Editar evento</a
								>
								<a
									href={matchcard.hasSummaryPost
										? `/admin/blog/update/${matchcard.id}`
										: `/admin/matchcards/summary?id=${matchcard.id}`}
									><i class="bi bi-card-text" aria-hidden="true"></i>
									{matchcard.hasSummaryPost ? 'Editar resumen' : 'Crear resumen'}</a
								>
								<div class="export-actions">
									<a href="/admin/matchcards/export/{matchcard.id}" download
										><i class="bi bi-file-earmark-code" aria-hidden="true"></i> Exportar JSON</a
									>
									<a href="/admin/matchcards/export/txt?id={matchcard.id}" download
										><i class="bi bi-file-earmark-spreadsheet" aria-hidden="true"></i> Exportar CSV</a
									>
								</div>
								<form method="post" use:enhance onsubmit={checkConfirmation}>
									<button type="submit" name="delete_event" value={matchcard.id}
										><i class="bi bi-trash" aria-hidden="true"></i> Eliminar evento</button
									>
								</form>
							</div>
						</details>
					</footer>
				</article>
			{:else}
				<div class="empty-state">
					<i class="bi bi-calendar2-event" aria-hidden="true"></i>
					<h3>Todavía no hay eventos en {data.selectedYear}</h3>
					<p>Crea un evento para empezar a preparar su cartelera.</p>
					<a href="/admin/matchcards/event"
						>Crear evento <i class="bi bi-arrow-right" aria-hidden="true"></i></a
					>
				</div>
			{/each}
		</div>
	</section>
</div>

<style>
	.matchcards-page {
		color: #172033;
	}
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		flex-wrap: wrap;
	}
	.page-header h1 {
		margin: 0;
	}
	.page-header p {
		margin: 8px 0 0;
		color: #667085;
		font-size: 0.9rem;
	}
	.create-event {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background: #215cc5;
		color: white;
		padding: 12px 18px;
		border-radius: 10px;
		font-weight: 600;
		text-decoration: none;
	}
	.create-event:hover {
		background: #18499f;
	}
	.year-filters {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		margin: 24px 0;
	}
	.year-filters a {
		padding: 8px 16px;
		border-radius: 8px;
		color: #596579;
		text-decoration: none;
		font-weight: 600;
	}
	.year-filters a:hover {
		background: #e8edf5;
	}
	.year-filters a.active {
		color: #194fa7;
		background: #e5edfc;
	}
	.section-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 16px;
	}
	.section-heading h2 {
		margin: 0;
		font-size: 1.15rem;
	}
	.section-heading > span {
		color: #667085;
		font-size: 0.85rem;
		white-space: nowrap;
	}
	.event-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
		gap: 20px;
		align-items: start;
	}
	.event-card {
		min-width: 0;
		overflow: hidden;
		background: #fff;
		border: 1px solid #e4e7ec;
		border-radius: 16px;
		box-shadow: 0 3px 12px #17203308;
	}
	.event-artwork {
		margin: 16px 16px 0;
		height: 160px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.event-artwork img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 10px;
	}
	.event-content {
		padding: 18px 20px 20px;
	}
	.event-date {
		display: flex;
		gap: 7px;
		align-items: center;
		margin: 0 0 10px;
		color: #667085;
		font-size: 0.78rem;
	}
	.event-title {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}
	.event-title h3 {
		margin: 0;
		font-size: 1.3rem;
		line-height: 1.25;
		overflow-wrap: anywhere;
	}
	.rating {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		flex-shrink: 0;
		padding: 5px 8px;
		border-radius: 7px;
		background: #fff6e4;
		color: #895600;
		font-size: 0.8rem;
		font-weight: 600;
	}
	.rating i {
		color: #d88a00;
	}
	.event-stats {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
		margin-top: 12px;
		font-size: 0.82rem;
		color: #667085;
	}
	.event-stats strong {
		color: #344054;
		font-weight: 600;
	}
	.event-actions {
		border-top: 1px solid #edf0f4;
		padding: 14px 16px 8px;
	}
	.primary-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.primary-actions a {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 7px;
		min-height: 42px;
		border: 1px solid #e0e5ed;
		border-radius: 8px;
		color: #344054;
		text-decoration: none;
		font-size: 0.82rem;
		font-weight: 600;
	}
	.primary-actions .matches-link {
		color: #215cc5;
		background: #eef4ff;
		border-color: #e0eaff;
	}
	.primary-actions a:hover {
		background: #e5edfa;
		border-color: #c1d2ee;
	}
	.more-actions summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 44px;
		padding: 0 4px;
		color: #667085;
		font-size: 0.8rem;
		cursor: pointer;
		list-style: none;
	}
	.more-actions summary::-webkit-details-marker {
		display: none;
	}
	.more-actions summary > i {
		font-size: 0.7rem;
	}
	.more-actions[open] summary > i {
		transform: rotate(180deg);
	}
	.secondary-actions {
		display: grid;
		gap: 2px;
		border-top: 1px solid #edf0f4;
		padding: 8px 0 4px;
	}
	.secondary-actions a,
	.secondary-actions button {
		display: flex;
		align-items: center;
		gap: 9px;
		width: 100%;
		box-sizing: border-box;
		padding: 11px 8px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		color: #475467;
		text-decoration: none;
		font-family: inherit;
		font-size: 0.8rem;
		text-align: left;
		cursor: pointer;
	}
	.secondary-actions a:hover {
		background: #f3f5f8;
	}
	.export-actions {
		display: flex;
		flex-wrap: wrap;
		border-top: 1px solid #edf0f4;
		margin-top: 4px;
		padding-top: 4px;
	}
	.export-actions a {
		flex: 1;
		white-space: nowrap;
	}
	.secondary-actions form {
		margin: 4px 0 0;
		border-top: 1px solid #edf0f4;
		padding-top: 4px;
	}
	.secondary-actions button {
		color: #bd3030;
	}
	.secondary-actions button:hover {
		background: #fff1f1;
	}
	a:focus-visible,
	summary:focus-visible,
	button:focus-visible {
		outline: 3px solid #7da6ef;
		outline-offset: 3px;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		background: #fff;
		border: 1px dashed #d0d5dd;
		border-radius: 16px;
		padding: 48px 20px;
	}
	.empty-state > i {
		color: #667085;
		font-size: 2rem;
	}
	.empty-state h3 {
		margin: 16px 0 8px;
	}
	.empty-state p {
		color: #667085;
		margin: 0 0 20px;
	}
	.empty-state a {
		color: #215cc5;
		font-weight: 600;
	}
	@media (max-width: 480px) {
		.page-header {
			gap: 16px;
		}
		.event-grid {
			gap: 16px;
		}
		.section-heading h2 {
			font-size: 1rem;
		}
	}
</style>
