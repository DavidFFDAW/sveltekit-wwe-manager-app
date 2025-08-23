<script lang="ts">
	import StarRating from '$lib/components/forms/rating/star-rating.svelte';
	import type { MatchItem } from './types';

	export let match: MatchItem;
	export let matches: MatchItem[] = [];

	const recalculateOrders = (direction: 'up' | 'down') => () => {
		matches = matches.map((innerMatch) => {
			if (match.inner_identifier === innerMatch.inner_identifier) {
				const order = match.order || 1;
				return { ...match, order: order + (direction === 'up' ? -1 : 1) };
			}
			return innerMatch;
		});
	};

	$: winnerOptions = match.participants.split(' VS ');
</script>

<div class="w1 flex start astart gap-smaller match-container match-card-single-match">
	<div class="order-buttons flex column">
		<button
			type="button"
			class="btn small info"
			aria-label="Mover hacia arriba"
			on:click|preventDefault={recalculateOrders('up')}
		>
			<i class="bi bi-arrow-up"></i>
		</button>
		<button
			type="button"
			class="btn small info"
			aria-label="Mover hacia abajo"
			on:click|preventDefault={recalculateOrders('down')}
		>
			<i class="bi bi-arrow-down"></i>
		</button>
	</div>

	<div class="w1 datas-container">
		<input type="hidden" class="input" name="match_id[]" bind:value={match.id} />

		<label class="form-item">
			<span class="label">Tipo</span>
			<input type="text" class="input" name="match_stipulation[]" bind:value={match.stipulation} />
		</label>

		<label class="form-item">
			<span class="label">Championship</span>
			<input
				type="text"
				class="input"
				name="match_championship[]"
				bind:value={match.championship}
			/>
		</label>

		<label class="form-item">
			<span class="label">Participantes</span>
			<input class="input" name="match_participants[]" bind:value={match.participants} />
		</label>

		<label class="form-item">
			<span class="label">Orden</span>
			<input type="number" class="input" name="match_order[]" bind:value={match.order} />
		</label>

		<label class="form-item">
			<span class="label">Ganador</span>
			<select class="input" name="match_winner[]" bind:value={match.winner}>
				{#each winnerOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</label>

		<label class="form-item rating-label-container">
			<span class="label">Valoración</span>
			<div class="star-rating-container">
				<StarRating name="match_rating[]" bind:rating={match.rating as number} />
			</div>
		</label>
	</div>
</div>

<style>
	.match-container.match-card-single-match {
		padding-top: 10px;
	}
	.form-item {
		display: flex;
		flex-direction: row;
		gap: 5px;
	}
	.form-item span.label {
		flex-basis: 180px;
		font-weight: 800;
	}

	.form-item select,
	.form-item input {
		padding: 2px 8px 2px 8px;
		background-color: transparent;
		border: none;
		border-bottom: 1px solid #ccc;
		border-radius: 0;
	}

	.btn.info.small {
		border: 1px solid #1da1f2;
		background-color: transparent;
		color: #1da1f2;
	}
	.form-item.rating-label-container .star-rating-container {
		width: 100%;
		padding: 2px 8px;
	}
</style>
