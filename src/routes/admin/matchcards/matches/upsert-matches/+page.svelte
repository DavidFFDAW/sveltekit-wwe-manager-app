<script lang="ts">
	import { tick } from 'svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import MatchItem from './match-item.svelte';

	let { data = $bindable() } = $props();
	let showSecondNight = $state(false);
	let _inner = $state(data.match_card);
	let matches = $state(data.match_card.matches);
	let hasMultipleNights = $derived(showSecondNight || matches.some((m) => m.night === 2));

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
		const targetMatch = matches.find((m) => m.order === targetOrder && m.night === match.night);
		const lastOrder = Math.max(
			0,
			...matches.filter((m) => m.night === match.night).map((m) => m.order)
		);
		if (targetOrder < 1 || targetOrder > lastOrder) return;

		if (targetMatch) targetMatch.order = currentOrder;
		match.order = targetOrder;
		matches = [...matches];
	};

	const handleAddMatch = (night: number) => {
		const id = Date.now();
		matches = [
			...matches,
			{
				id: id,
				order: Math.max(0, ...matches.filter((m) => m.night === night).map((m) => m.order)) + 1,
				stipulation: '',
				championship: '',
				participants: '',
				night,
				type: 'create'
			}
		];

		tick().then(() => {
			const matchElement = document.querySelector(`[data-identifier="${id}"]`);
			if (matchElement) {
				matchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
				matchElement
					.querySelector<HTMLInputElement>('input:not([type=hidden])')
					?.focus({ preventScroll: true });
			}
		});
	};
</script>

<header class="editor-header">
	<div>
		<a href="/admin/matchcards">← Volver a eventos</a>
		<h1>{_inner.matchCard.ppv_name}</h1>
		<p>Edita la cartelera por noche y guarda los cambios al terminar.</p>
	</div>
	{#if !hasMultipleNights}<button type="button" onclick={() => (showSecondNight = true)}
			><i class="bi bi-plus-lg" aria-hidden="true"></i> Añadir noche 2</button
		>{/if}
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

			<div class="night-lists">
				{#each hasMultipleNights ? [1, 2] : [1] as night}
					<section class="night-section" aria-labelledby="night-{night}">
						<header class="night-header">
							<div>
								<h2 id="night-{night}">Noche {night}</h2>
								<span
									>{matches.filter((m) => m.night === night && m.type !== 'delete').length} combates</span
								>
							</div>
							<button type="button" onclick={() => handleAddMatch(night)}
								><i class="bi bi-plus-lg" aria-hidden="true"></i> Añadir combate</button
							>
						</header>
						<div class="match-list">
							{#each matches as match, index (match.id)}
								{#if match.night === night}
									<div class="match-row" style:order={match.order}>
										<MatchItem
											matches={Math.max(
												0,
												...matches.filter((m) => m.night === night).map((m) => m.order)
											)}
											bind:match={matches[index]}
											{handleToggleDelete}
											{handleChangeOrder}
										/>
									</div>
								{/if}
							{/each}
							{#if !matches.some((m) => m.night === night)}<p class="empty-night">
									Esta noche todavía no tiene combates. A?ade el primero para preparar la cartelera.
								</p>{/if}
						</div>
					</section>
				{/each}
			</div>
		</AsyncForm>
	</div>
</div>

<style>
	.editor-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		margin-bottom: 24px;
	}
	.editor-header a {
		color: #596579;
		font-size: 0.82rem;
		text-decoration: none;
	}
	.editor-header h1 {
		margin: 10px 0 6px;
		font-size: 1.5rem;
		overflow-wrap: anywhere;
	}
	.editor-header p {
		margin: 0;
		color: #667085;
		font-size: 0.88rem;
	}
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 10px 14px;
		border: 1px solid #d6deeb;
		border-radius: 8px;
		background: #fff;
		color: #215cc5;
		font: inherit;
		font-size: 0.82rem;
		cursor: pointer;
		min-height: 42px;
	}
	button:hover {
		background: #edf3ff;
	}
	button:focus-visible {
		outline: 3px solid #7da6ef;
		outline-offset: 2px;
	}
	.night-lists {
		display: grid;
		gap: 28px;
		padding-bottom: 24px;
		width: 100%;
	}
	.night-section {
		min-width: 0;
	}
	.night-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
		flex-wrap: wrap;
	}
	.night-header > div {
		display: flex;
		align-items: baseline;
		gap: 12px;
	}
	.night-header h2 {
		margin: 0;
		font-size: 1.1rem;
	}
	.night-header span {
		font-size: 0.8rem;
		color: #667085;
	}
	.match-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.match-row {
		min-width: 0;
	}
	.empty-night {
		margin: 0;
		padding: 28px 20px;
		text-align: center;
		color: #667085;
		background: #fff;
		border: 1px dashed #cdd5e0;
		border-radius: 10px;
		font-size: 0.88rem;
	}
</style>
