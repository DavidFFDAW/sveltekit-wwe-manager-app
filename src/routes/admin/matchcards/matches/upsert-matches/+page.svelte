<script lang="ts">
	import { tick } from 'svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import MatchItem from './match-item.svelte';

	let { data = $bindable() } = $props();
	let _inner = $state(data.match_card);
	let matches = $state(data.match_card.matches);
	let orders = $derived(matches.map((m) => m.order));

	$effect(() => {
		_inner = data.match_card;
		matches = data.match_card.matches;
	});

	const handleToggleDelete = (match: any) => {
		if (match.type === 'create') {
			matches = matches.filter((m) => m.id !== match.id);
		} else {
			match.type = match.type === 'delete' ? 'update' : 'delete';
		}
	};

	const handleChangeOrder = (match: any, direction: 'up' | 'down') => () => {
		if (match.type === 'delete') return;

		const currentOrder = match.order;
		const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
		const targetMatch = matches.find((m) => m.order === targetOrder);
		if (targetOrder < 1 || targetOrder > orders.length) return;

		if (targetMatch) targetMatch.order = currentOrder;
		match.order = targetOrder;
		matches = [...matches];
	};

	const handleAddMatch = () => {
		const id = Date.now();
		matches = [
			...matches,
			{
				id: id,
				order: orders.length > 0 ? Math.max(...orders) + 1 : 1,
				stipulation: '',
				championship: '',
				participants: '',
				night: 1,
				type: 'create'
			}
		];

		tick().then(() => {
			const matchElement = document.querySelector(`[data-identifier="${id}"]`);
			if (matchElement) matchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		});
	};
</script>

<header class="sticky-page-header flex between">
	<div class="flex gap-small">
		<h1 class="page-title">{_inner.matchCard.ppv_name}</h1>
	</div>

	<button type="button" class="btn rounded cta" onclick={handleAddMatch}>
		<i class="bi bi-plus"></i>
		<span class="label">Añadir combate</span>
	</button>
</header>

<div class="matchcard-page">
	<datalist id="stipulations">
		<option value="Single Match">Single Match</option>
		<option value="Tag Team Match">Tag Team Match</option>
		<option value="No Holds Barred">No Holds Barred</option>
		<option value="Ladder Match">Ladder Match</option>
		<option value="Extreme Rules">Extreme Rules</option>
		<option value="Street Fight">Street Fight</option>
		<option value="Falls Count Anywhere">Falls Count Anywhere</option>
		<option value="Steel Cage Match">Steel Cage Match</option>
		<option value="Hell in a Cell">Hell in a Cell</option>
		<option value="I quit">I quit</option>
		<option value="Money in the Bank">Money in the Bank</option>
		<option value="Royal Rumble">Royal Rumble</option>
		<option value="Elimination Chamber">Elimination Chamber</option>
	</datalist>

	<datalist id="wrestlers">
		{#each _inner.wrestlers as wrestler}
			<option value={wrestler.name}>{wrestler.name}</option>
		{/each}
	</datalist>

	<datalist id="championships">
		{#each _inner.championships as championship}
			<option value={championship.name}>{championship.name}</option>
		{/each}
	</datalist>

	<div class="page-container">
		<AsyncForm
			method="post"
			classes="w1 down"
			buttonText="Guardar combates"
			updateId={_inner.matchCard?.id}
		>
			<input type="hidden" name="slug" bind:value={_inner.slug} />
			<input type="hidden" name="ppv_card_id" bind:value={_inner.matchCard.id} />

			<div class="w1 grid ppv-matches-container">
				{#each matches as _, index (_.id)}
					<MatchItem
						matches={matches.length}
						bind:match={matches[index]}
						{handleToggleDelete}
						{handleChangeOrder}
					/>
				{/each}
			</div>

			<div class="w1 flex end"></div>
		</AsyncForm>
	</div>
</div>

<style>
	header.sticky-page-header h1.page-title {
		font-size: 1.5rem;
		font-family: 'SourceSans', sans-serif;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		word-spacing: 0.1em;
		white-space: nowrap;
	}
	.grid.ppv-matches-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 15px;
	}
	.sticky-page-header {
		position: sticky;
		top: 0;
		left: 0;
		width: calc(100% + 30px);
		background: #fff;
		padding: 15px;
		margin: 0 -15px;
		margin-top: -15px;
		display: flex;
		align-items: center;
		gap: 15px;
		border-radius: 0;
		border-bottom: 1px solid #333;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		z-index: 5;
	}
	.sticky-page-header button {
		font-size: 0.91rem;
		border-color: #333;
		background-color: transparent;
		padding: 6px 12px;
		color: #333;
	}

	.sticky-page-header h1.page-title {
		font-size: 1.2rem !important;
	}

	@media only screen and (max-width: 768px) {
		.sticky-page-header {
			margin-top: -45px;
			flex-direction: column;
			align-items: center;
		}
		.sticky-page-header button {
			width: 100%;
			padding: 4px 12px;
		}

		.grid.ppv-matches-container {
			grid-template-columns: 1fr;
			margin-top: 20px;
			margin-bottom: 20px;
			padding: 0 10px;
			gap: 20px;
		}
	}
</style>
