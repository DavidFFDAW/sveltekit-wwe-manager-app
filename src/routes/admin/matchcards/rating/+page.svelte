<script lang="ts">
	let { data } = $props();
	let event = data.rating.event;
	let matches = data.rating.matches;
	let ratings = $derived(matches.map((match) => match.rating).filter((rating) => rating !== null));
	let averageRating = $derived(
		ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length || 0
	);

	$inspect({
		matches: matches.length,
		ratings: ratings.length,
		averageRating
	});
</script>

<div class="page">
	<header class="page-header">
		<h1>Valoraciones</h1>
		<small>Valoraciones para el evento {event.ppv_name}</small>
	</header>

	<div class="rating-page-container">
		<p>
			Valoración media de <strong class="rumble">{event.ppv_name}</strong>:
			{averageRating.toFixed(2)} estrellas
		</p>
		<!-- <code>{JSON.stringify(event.matches, null, 2)}</code> -->
		<ul class="w1 list grid matches-grid">
			{#each matches as match}
				<li class="w1 list-item card box flex total column astart gap-5">
					<span class="badge badge-card-order">{match.order}</span>
					<span>
						{match.stipulation}
					</span>
					<span>{match.participants}</span>
					{#if match.rating}
						<span
							class="rumble rating badge"
							class:rating-bad={match.rating > 0 && match.rating < 3}
							class:rating-good={match.rating >= 3}
							class:rating-very-good={match.rating === 4}
							class:rating-excellent={match.rating === 5}
						>
							<i class="bi bi-star-fill"></i>
							{match.rating}
						</span>
					{:else}
						<span class="badge">Sin valorar</span>
					{/if}
					<span>{match.winner}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	:root {
		--rating-color: #f39c12;
	}
	.rating-bad {
		--rating-color: #e74c3c;
	}
	.rating-good {
		--rating-color: #f39c12;
	}
	.rating-very-good {
		--rating-color: #27ae60;
	}
	.rating-excellent {
		--rating-color: #8e44ad;
	}
	.matches-grid {
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}
	.badge {
		font-size: 0.9rem;
		padding: 0.25em 1em;
		border-radius: 25px;
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		color: #333;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}
	.rating.rumble {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--rating-color);
	}
</style>
