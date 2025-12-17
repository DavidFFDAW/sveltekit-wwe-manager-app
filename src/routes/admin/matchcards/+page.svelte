<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import Image from '$lib/components/visual/image.svelte';

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
					class="w1 matchcard relative box flex start astart gap-smaller responsive"
					data-href="/admin/matchcards/upsert?slug={matchcard.id}"
				>
					<Image
						src={matchcard.ppv_image}
						class="responsive-w1 w1-responsive rounded"
						fallback="/noimage.jpg"
						alt={matchcard.ppv_name}
						width="120"
					/>
					<div class="flex column start astart nogap">
						<h2>{matchcard.ppv_name}</h2>
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

					<div class="action-buttons-container">
						<a
							href="/admin/matchcards/event?slug={matchcard.id}"
							class="btn small warn"
							aria-label="Editar"
						>
							<i class="bi bi-pencil"></i>
						</a>
						<a
							href="/admin/matchcards/matches/upsert?slug={matchcard.id}"
							class="btn small warn"
							aria-label="Editar combates"
						>
							<i class="bi bi-pencil"></i>
							<span>combates</span>
						</a>
						<a
							href="/admin/matchcards/export/{matchcard.id}"
							class="btn small info"
							aria-label="Exportar evento"
							download
						>
							<i class="bi bi-box-arrow-up-right"></i>
							<span>exportar</span>
						</a>
					</div>
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
</style>
