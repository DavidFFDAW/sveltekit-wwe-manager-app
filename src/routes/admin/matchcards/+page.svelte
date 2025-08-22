<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import Debug from '$lib/components/visual/debug.svelte';
	import Image from '$lib/components/visual/image.svelte';

	export let data;
</script>

<div class="matchcards-page">
	<header class="page-header">
		<h1>Eventos con cartelera</h1>
		<small>Consuta aquí los combates de cada evento registrado</small>
	</header>

	<section class="w1 down eventcard-events-list flex column gap-small">
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
					<small>Este evento tiene {matchcard.matches} combates registrados</small>
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
				</div>
			</div>
		{/each}
	</section>

	<ButtonCreate endpoint="matchcards/event" />
</div>
