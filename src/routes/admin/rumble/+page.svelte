<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import type { Rumble, Wrestler } from '@prisma/client';

	let { data } = $props();
	const winners = $derived(data.rumbles) as (Rumble & { winner: Wrestler })[];
</script>

<div class="page">
	<header class="page-header">
		<h1>Royal Rumble</h1>
		<small>Administración de eventos Royal Rumble</small>
	</header>
</div>

<section class="royal-rumble-page">
	{#if data.rumbles.length > 0}
		<ul class="rumble-winners-list">
			{#each winners as rumble}
				<li class="w1 item list-item wrestler-rumble-winner rumble-winner-item">
					<img
						width="100"
						height="auto"
						src={rumble.winner.image_name}
						alt={rumble.winner.name}
						class="wrestler-image"
						draggable="false"
					/>

					<div class="wrestler-info">
						<h3 class="wrestler-name dreadnotus uppercase">{rumble.winner.name}</h3>
						<a href={`/admin/rumble/upsert/${rumble.id}`} class="btn secondary small">
							Editar ganador
						</a>
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

	<ButtonCreate endpoint="/rumble/upsert" />
</section>

<style>
	.page > * {
		margin: 50px 0;
	}
	.page > *:first-child {
		margin-top: 0;
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
		z-index: 2;
		gap: 2px;
	}
</style>
