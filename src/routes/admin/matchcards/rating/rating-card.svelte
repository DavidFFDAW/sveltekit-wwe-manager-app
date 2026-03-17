<script lang="ts">
	let { match } = $props();
	let matchData = $state(match);
	let rating = $state(match.rating || 0);
	const step = 0.5;

	const get_rating_class = (rating: number) => {
		if (rating > 0 && rating < 3) return 'bad';
		if (rating >= 3 && rating < 4) return 'nice';
		if (rating >= 4 && rating < 5) return 'good';
		if (rating >= 5) return 'excellent';
		return 'terrible';
	};
	let rating_tag = $derived(get_rating_class(rating));
	let participants = $derived(matchData.participants.split('VS').map((p: string) => p.trim()));
</script>

<div
	class="w1 match-card rating-card rating-{rating_tag} relative"
	class:notice={rating === null || !matchData.winner}
>
	<h3 class="w1 tcenter underline">{matchData.stipulation}</h3>
	<p class="w1 tcenter">
		{matchData.championship ? `${matchData.championship}` : 'Sin titulo en juego'}
	</p>

	<div class="match-participants">
		{#each participants as participant}
			<div class="participant-item">{participant}</div>
		{/each}
	</div>

	<datalist id="match-{matchData.id}-participants">
		<option value="No contest">No contest</option>
		{#each participants as participant}
			<option value={participant}>{participant}</option>
		{/each}
	</datalist>

	<!-- <pre>{JSON.stringify(matchData, null, 4)}</pre> -->

	<div class="w1 rating-container flex start acenter gap-smaller">
		<div class="rating relative">
			<i class="bi bi-star-fill"></i>
			<span class="rumble">{rating}</span>
		</div>

		<div class="w1 flex column">
			<label class="label">
				<span class="label">Ganador</span>
				<input
					type="text"
					class="w1 total"
					name="winner[{matchData.id}]"
					bind:value={matchData.winner}
					list="match-{matchData.id}-participants"
				/>
			</label>

			<input
				type="range"
				class="w1 rating-range"
				name="rating[{matchData.id}]"
				min="0"
				max="5"
				{step}
				bind:value={rating}
			/>

			<input type="hidden" name="matches[]" value={matchData.id} />
		</div>
	</div>
</div>

<style>
	:root {
		--rating-color: #f39c12;
	}
	.rating-terrible {
		--rating-color: #c0392b;
	}
	.rating-bad {
		--rating-color: #e74c3c;
	}
	.rating-nice {
		--rating-color: #f39c12;
	}
	.rating-good {
		--rating-color: #27ae60;
	}
	.rating-excellent {
		--rating-color: #8e44ad;
	}
	.rating-card {
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.rating-card.notice {
		border-color: #e74c3c;
		box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
	}
	.rating-card h3 {
		text-decoration: underline;
	}
	.rating-card h3 + p {
		margin-bottom: 0.5rem;
	}
	.rating-card .rating {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--rating-color);
	}

	.rating-card .rating span {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 1.2rem;
		font-weight: 600;
		color: #fff;
	}
	.rating-card .rating i {
		font-size: 4rem;
	}

	.match-participants {
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-bottom: 0.8rem;
		gap: 8px;
	}
	.match-participants .participant-item {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		border: 1px solid #ccc;
		background-color: #fff;
		font-weight: 500;
		font-size: 1rem;
		color: #333;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.btn.btn-rating-action {
		padding: 6px;
		height: 100%;
		border: 1px solid #ccc;
		background-color: #fff;
		border-radius: 4px;
	}
</style>
