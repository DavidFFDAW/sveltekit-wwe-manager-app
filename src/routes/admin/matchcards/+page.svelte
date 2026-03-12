<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	export let data;
</script>

<div class="matchcards-page">
	<header class="page-header">
		<h1>Cartelera de eventos</h1>
		<small>Consulta aquí los combates de cada evento registrado</small>
	</header>

	<div class="box filters-box">
		<form action="" method="get" class="flex acenter gap-smaller">
			{#each data.uniqueYears as year}
				<button
					type="submit"
					name="year"
					value={year}
					class="btn filter rounded"
					class:active={data.selectedYear === year}
					disabled={data.selectedYear === year}
				>
					{year}
				</button>
			{/each}
		</form>
	</div>

	<section class="w1 down eventcard-events-list">
		<h2 class="w1">Eventos del año: {data.selectedYear}</h2>

		<div class="w1 ppv-match-card-list flex column gap-small">
			{#each data.matchcards as matchcard}
				<div
					class="w1 matchcard relative box"
					data-href="/admin/matchcards/upsert?slug={matchcard.id}"
				>
					<div class="w1 flex start astart gap-smaller responsive">
						<img
							width="120"
							src={matchcard.ppv_image}
							class="responsive-w1 w1-responsive rounded"
							use:errorimage={'/noimage.jpg'}
							alt={matchcard.ppv_name}
							title={matchcard.ppv_name}
							loading="lazy"
							draggable="false"
						/>
						<div class="flex column start astart nogap">
							<h2>
								{matchcard.ppv_name}
								<small class="year">({matchcard.ppv_date?.getFullYear()})</small>
							</h2>
							<small><strong>{matchcard.matches} combates</strong> registrados</small>
							{#if matchcard.ppv_date}
								<small>
									{matchcard.ppv_date.toLocaleDateString('es-ES', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</small>
							{/if}
						</div>
					</div>

					<footer class="custom-action-buttons-container">
						<a
							href="/admin/matchcards/event?slug={matchcard.id}"
							class="btn small warn rounded icon"
							aria-label="Editar"
						>
							<i class="bi bi-pencil"></i>
							<span>Editar evento</span>
						</a>
						<a
							href="/admin/matchcards/matches/upsert?slug={matchcard.id}"
							class="btn small warn rounded icon"
							aria-label="Editar combates"
						>
							<i class="bi bi-pencil"></i>
							<span>Editar combates</span>
						</a>
						<a
							href="/admin/matchcards/rating?slug={matchcard.id}"
							class="btn small success rounded icon"
							aria-label="Valoraciones"
						>
							<i class="bi bi-star"></i>
							<span>Editar valoraciones</span>
						</a>
						<a
							href="/admin/matchcards/export/{matchcard.id}"
							class="btn small info rounded icon"
							aria-label="Exportar evento"
							download
						>
							<i class="bi bi-file-earmark-code"></i>
							<span>Exportar JSON</span>
						</a>
						<a
							href="/admin/matchcards/export/txt?id={matchcard.id}"
							class="btn small info rounded icon"
							aria-label="Exportar evento a csv"
							download
						>
							<i class="bi bi-file-earmark-spreadsheet"></i>
							<span>Exportar CSV</span>
						</a>
					</footer>
				</div>
			{/each}
		</div>
	</section>

	<ButtonCreate endpoint="matchcards/event" />
</div>

<style>
	.filters-box {
		margin: 20px 0;
	}

	.matchcard.box {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.matchcard.box h2 {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.matchcard.box h2 .year {
		font-size: 0.8rem;
		font-weight: light;
		color: #7f7f7f;
	}
	.custom-action-buttons-container {
		width: 100%;
		display: flex;
		margin-top: 5px;
		padding-top: 15px;
		border-top: 1px solid #ccc;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		gap: 5px;
	}

	.custom-action-buttons-container a {
		flex-grow: 1;
		flex-shrink: 0;
		text-align: center;
	}
</style>
