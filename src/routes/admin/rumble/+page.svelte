<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import NumberInputControls from '$lib/components/forms/inputs/number-input-controls.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import type { Rumble, Wrestler } from '@prisma/client';

	let { data } = $props();
	const currentYear = new Date().getFullYear();
	const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
	let activeLetter = $state<string>('a');
	let rumbleType = $state<string>('m');
	let wrestlerList = $derived(
		data.wrestlers.filter((wrestler) => wrestler.sex.toLowerCase() === rumbleType)
	);
	let filteredList = $derived(
		wrestlerList.filter((wrestler) => wrestler.name.toLowerCase().startsWith(activeLetter))
	);
	const winners = $derived(data.rumbles) as (Rumble & { winner: Wrestler })[];
</script>

<div class="page">
	<header class="page-header">
		<h1>Royal Rumble</h1>
		<small>Administración de eventos Royal Rumble</small>
	</header>
</div>

<Box title="Crear ganador" icon="people">
	<AsyncForm method="post" showButtons={false} reset={true}>
		<div class="w1 rumble-form-details flex total responsive start astart gap-small">
			<div class="rumble-wrestlers-block">
				<div class="letters-container">
					{#each letters as letter}
						<button
							type="button"
							class="btn small icon-sm {activeLetter === letter ? 'cta' : 'secondary'}"
							value={letter}
							onclick={() => (activeLetter = letter)}
						>
							{letter.toUpperCase()}
						</button>
					{/each}
				</div>

				<ul class="wrestlers-list">
					{#each filteredList as wrestler}
						<li class="wrestler-item block wrestler-brand-{wrestler.brand.toLowerCase()}">
							<label class="relative block">
								<input
									type="radio"
									name="winner_id"
									checked={true}
									value={wrestler.id}
									class="app-radio"
								/>
								<div class="inner app-radio-inner">
									<p>{wrestler.name}</p>
								</div>
							</label>
						</li>
					{/each}
				</ul>
			</div>
			<div class="rumble-datas-block flex column gap-small astart">
				<RadioList
					label="Tipo de Royal Rumble"
					name="rumble_type"
					bind:value={rumbleType}
					options={[
						{ label: 'Masculino', value: 'm' },
						{ label: 'Femenino', value: 'f' }
					]}
				/>

				<NumberInputControls
					label="Año del Royal Rumble"
					name="year"
					min="1988"
					max={currentYear}
					value={currentYear}
					required={true}
				/>

				<NumberInputControls
					label="Posicion de entrada"
					name="entry_number"
					min="1"
					max="30"
					value={25}
					required={true}
				/>

				<ToggleInput label="¿Tuvo exito en WrestleMania?" name="successful" checked={false} />
			</div>
		</div>

		<div class="w1 flex end acenter down">
			<button class="btn cta icon icon-gap-5" type="submit">
				<i class="bi bi-plus-circle-fill"></i>
				Crear ganador
			</button>
		</div>
	</AsyncForm>
</Box>

<section class="royal-rumble-page">
	{#if data.rumbles.length > 0}
		<ul class="rumble-winners-list">
			{#each winners as rumble}
				<li class="w1 item list-item wrestler-rumble-winner rumble-winner-item">
					<img
						src={rumble.winner.image_name}
						alt={rumble.winner.name}
						width="120"
						height="auto"
						class="wrestler-image"
						draggable="false"
					/>

					<div class="wrestler-info">
						<h3 class="wrestler-name dreadnotus uppercase">{rumble.winner.name}</h3>
						<p class="wrestler-successful">
							{rumble.successful ? 'Tuvo' : 'No tuvo'} éxito en WrestleMania
						</p>
					</div>
					<p class="year">{rumble.year}</p>
					<p class="entry entry-number rumble">
						<span class="line"></span>
						<span class="entry-number-text">{rumble.entry_number}</span>
						<span class="line"></span>
					</p>
				</li>
			{/each}
		</ul>
	{:else}
		<h2>No hay ganadores de Royal Rumble registrados.</h2>
	{/if}
</section>

<style>
	.page > * {
		margin: 50px 0;
	}
	.page > *:first-child {
		margin-top: 0;
	}

	.rumble-wrestlers-block {
		min-height: 300px;
		max-height: 300px;
		border: 1px solid #ccc;
		padding: 10px 15px;
		border-radius: 5px;
		overflow-y: auto;
	}
	.rumble-wrestlers-block .letters-container {
		display: flex;
		overflow: auto;
		padding-bottom: 4px;
		gap: 5px;
	}

	.rumble-wrestlers-block .wrestlers-list {
		margin-top: 10px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 10px;
	}
	.rumble-wrestlers-block .wrestlers-list .wrestler-item.wrestler-brand-raw {
		--brand-color: var(--raw);
	}
	.rumble-wrestlers-block .wrestlers-list .wrestler-item.wrestler-brand-smackdown,
	.rumble-wrestlers-block .wrestlers-list .wrestler-item.wrestler-brand-sd {
		--brand-color: var(--sd);
	}
	.rumble-wrestlers-block .wrestlers-list .wrestler-item.wrestler-brand-awl {
		--brand-color: var(--awl);
	}
	.rumble-wrestlers-block .wrestlers-list .wrestler-item label .inner {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 40px;
		position: relative;
		padding: 5px;
		border: 1px solid #ddd;
		border-radius: 5px;
		text-align: center;
		overflow: hidden;
		cursor: pointer;
	}
	.rumble-wrestlers-block .wrestlers-list .wrestler-item label .inner::after {
		content: '';
		position: absolute;
		bottom: 0;
		right: -2px;
		width: 50%;
		height: 100%;
		background-color: var(--brand-color);
		opacity: 0.2;
		clip-path: polygon(0 100%, 100% 100%, 100% 0);
		pointer-events: none;
		z-index: 1;
	}
	.rumble-wrestlers-block
		.wrestlers-list
		.wrestler-item
		label
		input[type='radio']:checked
		+ .inner {
		border-color: #0070f3;
		box-shadow: none;
		background-color: #e6f0ff;
		font-weight: 600;
	}

	.rumble-winners-list {
		margin-top: 20px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 10px;
	}
	.rumble-winners-list .list-item.rumble-winner-item {
		position: relative;
		min-height: 150px;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}
	.rumble-winners-list .list-item.rumble-winner-item img {
		width: 100%;
		max-width: 100%;
	}
	.rumble-winners-list .list-item.rumble-winner-item p.year {
		position: absolute;
		top: 10px;
		right: 10px;
		background-color: rgba(0, 0, 0, 0.4);
		border: 1px solid #ddd;
		font-size: 0.9rem;
		color: #fff;
		padding: 5px 20px;
		border-radius: 25px;
		font-weight: 600;
		z-index: 2;
	}

	.rumble-winners-list .list-item.rumble-winner-item p.entry.entry-number {
		position: absolute;
		top: 10px;
		left: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 2rem;
		color: #fff;
		border-radius: 0;
		font-weight: 900;
		z-index: 1;
	}
	.rumble-winners-list .list-item.rumble-winner-item p.entry.entry-number .line {
		width: 100%;
		height: 4px;
		background-color: var(--raw);
	}
	.rumble-winners-list .list-item.rumble-winner-item p.entry.entry-number .entry-number-text {
		padding: 6px;
		margin-top: 0px;
		line-height: 1;
		background-color: rgba(0, 0, 0, 0.8);
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.rumble-winners-list .list-item.rumble-winner-item .wrestler-info {
		position: relative;
		margin-top: 0px;
		padding: 10px;
		border-top: 3px solid #eee;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 2px;
		z-index: 2;
	}
</style>
