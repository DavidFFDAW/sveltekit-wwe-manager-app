<script lang="ts">
	import { onMount } from 'svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import RatingCard from './rating-card.svelte';

	let { data } = $props();
	let event = data.rating.event;
	let matches = $state(data.rating.matches.map((m) => ({ ...m, rating: m.rating || 0 })));
	let averageRating = $derived(
		matches.length > 0
			? matches.reduce((acc, match) => acc + (match.rating || 0), 0) / matches.length
			: 0
	);

	onMount(() => {
		const firstNotice = document.querySelector('.rating-card.notice');
		if (data.rating.notice && firstNotice) firstNotice.scrollIntoView({ behavior: 'smooth' });
	});
</script>

<div class="page">
	<header class="page-header">
		<h1>Valoraciones</h1>
		<small>Valoraciones para el evento {event.ppv_name}</small>
	</header>

	<AsyncForm
		method="post"
		classes="rating-page-container"
		buttonText="Guardar valoraciones"
		reset={true}
	>
		<p>
			Valoración media de <strong class="rumble">{event.ppv_name}</strong>:
			{averageRating.toFixed(2)} estrellas
		</p>

		<input type="hidden" name="ppv_id" value={event.id} />

		<div class="w1 list grid matches-grid">
			{#each matches as _, index}
				<RatingCard bind:match={matches[index]} />
			{/each}
		</div>
	</AsyncForm>
</div>

<style>
	.matches-grid {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}
</style>
