<script lang="ts">
	let { match = $bindable() } = $props();
	let hasOtherWinner = $state(match.winner ? !match.participants.includes(match.winner) : false);
	const step = 0.5;

	const get_rating_class = (rating: number) => {
		if (rating > 0 && rating < 3) return 'bad';
		if (rating >= 3 && rating < 4) return 'nice';
		if (rating >= 4 && rating < 5) return 'good';
		if (rating >= 5) return 'excellent';
		return 'terrible';
	};
	let rating_tag = $derived(get_rating_class(match.rating || 0));
	let participants = $derived(match.participants.split('VS').map((p: string) => p.trim()));
</script>

<div
	class="w1 match-card rating-card rating-{rating_tag} relative"
	class:notice={match.rating === null || !match.winner}
>
	<h3 class="w1 tcenter underline">{match.stipulation}</h3>
	<p class="w1 tcenter">
		{match.championship ? `${match.championship}` : 'Sin titulo en juego'}
	</p>

	{#if participants.length > 0}
		<div class="match-participants">
			<label class="w1 relative">
				<input
					type="radio"
					class="app-radio"
					name="winner[{match.id}]"
					bind:group={match.winner}
					value="No contest"
				/>
				<div class="inner participant-item">
					<span>No contest</span>
				</div>
			</label>

			{#each participants as participant}
				<label class="w1 relative">
					<input
						type="radio"
						class="app-radio"
						name="winner[{match.id}]"
						bind:group={match.winner}
						value={participant}
					/>
					<div class="inner participant-item">
						<span>{participant}</span>
					</div>
				</label>
			{/each}

			<div
				class="w1 alt-winner-container flex start acenter gap-5"
				class:has-alt-winner={hasOtherWinner}
			>
				<button
					type="button"
					class="btn small warn"
					onclick={() => (hasOtherWinner = !hasOtherWinner)}
				>
					<i class="bi bi-pencil"></i>
					<span class="label">Otro ganador</span>
				</button>

				{#if hasOtherWinner}
					<label class="label">
						<input
							type="text"
							class="input app-input"
							name="alt-winner[{match.id}]"
							placeholder="Otro ganador..."
							value={match.winner}
						/>
					</label>
				{/if}
			</div>
		</div>

		<datalist id="match-{match.id}-participants">
			<option value="No contest">No contest</option>
			{#each participants as participant}
				<option value={participant}>{participant}</option>
			{/each}
		</datalist>
	{/if}

	<div class="w1 rating-container flex start acenter gap-smaller">
		<div class="rating relative">
			<i class="bi bi-star-fill"></i>
			<span class="rumble">{match.rating}</span>
		</div>

		<input
			type="range"
			class="w1 rating-range"
			name="rating[{match.id}]"
			bind:value={match.rating}
			min="0"
			max="5"
			{step}
		/>

		<input type="hidden" name="matches[]" value={match.id} />
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

	.alt-winner-container {
		margin-top: 4px;
	}
	.alt-winner-container button {
		width: 100%;
		transition: none;
	}
	.alt-winner-container.has-alt-winner button {
		flex-grow: 0;
		width: auto;
		min-width: 25%;
	}
	.alt-winner-container.has-alt-winner > .label {
		width: 100%;
		flex-grow: 1;
		display: block;
	}
</style>
