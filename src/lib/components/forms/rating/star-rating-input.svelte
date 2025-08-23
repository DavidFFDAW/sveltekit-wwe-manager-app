<script lang="ts">
	import { onMount } from 'svelte';

	let raterContainer: HTMLDivElement;
	export let name: string;
	export let rating: number = 0;
	export let label: string = 'Valoracion';

	onMount(() => {
		const rater: any = 'raterJs' in window ? window.raterJs : null;
		if (!rater) return;
		console.log({ rater, window });

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

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/rater-js@1.0.1/index.min.js"></script>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rater-js@1.0.1/lib/style.min.css" />
</svelte:head>

<div class="form-item">
	<label class="label form-label {$$restProps.required ? 'required-label' : ''}">
		<span class="label form-label">{label}</span>
		<div class="flex start acenter gap-smaller">
			<div bind:this={raterContainer} class="star-rating star-rate-container"></div>
			<p class="rating-selected">{rating}</p>
		</div>

		<input type="hidden" {name} value={rating} />
	</label>
</div>

<style>
	label.label.form-label {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	label.label.form-label .rating-selected {
		font-size: 0.975rem;
		font-weight: 600;
		color: orangered;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
