<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import { onMount } from 'svelte';
	import RatingCard from './rating-card.svelte';

	let { data } = $props();
	let event = data.rating.event;
	let matches = data.rating.matches;
	let ratings = $derived(matches.map((match) => match.rating).filter((rating) => rating !== null));
	let averageRating = $derived(
		ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length || 0
	);

	onMount(() => {
		const firstNotice = document.querySelector('.rating-card.notice');
		if (data.rating.notice && firstNotice) firstNotice.scrollIntoView({ behavior: 'smooth' });
	});
	// let firstNight = $derived(data.rating.matches.filter((match) => match.night === 1));
	// let secondNight = $derived(data.rating.matches.filter((match) => match.night === 2));
</script>

<div class="page">
	<header class="page-header">
		<h1>Valoraciones</h1>
		<small>Valoraciones para el evento {event.ppv_name}</small>
	</header>

	<AsyncForm method="post" classes="rating-page-container">
		<p>
			Valoración media de <strong class="rumble">{event.ppv_name}</strong>:
			{averageRating.toFixed(2)} estrellas
		</p>

		<input type="hidden" name="ppv_id" value={event.id} />

		<div class="w1 list grid matches-grid">
			{#each matches as match}
				<RatingCard {match} />
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
