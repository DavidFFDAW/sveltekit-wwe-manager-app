<script lang="ts">
	import { onMount } from 'svelte';

	let raterContainer: HTMLDivElement;
	export let name: string;
	export let rating: number = 0;

	onMount(() => {
		const rater: any = 'raterJs' in window ? window.raterJs : null;
		if (!rater) {
			console.log('No raterJs was imported on time');
			return;
		}

		const myRater = rater({
			element: raterContainer,
			rateCallback: function rateCallback(innerRating: any, done: any) {
				rating = innerRating;
				myRater.setRating(rating); // Actualiza el componente visualmente
				done(); // Importante para finalizar la operación de rating
			},
			starSize: 24, // Opcional
			step: 0.5, // Permite medias estrellas
			rating: rating // Valor inicial
		});
	});
</script>

<div class="form-item">
	<div class="flex start acenter gap-smaller">
		<div bind:this={raterContainer} class="star-rating star-rate-container"></div>
		<p class="rating-selected">{rating}</p>
	</div>

	<input type="hidden" {name} value={rating} />
</div>

<style>
	.rating-selected {
		font-size: 0.975rem;
		font-weight: 600;
		color: orangered;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
