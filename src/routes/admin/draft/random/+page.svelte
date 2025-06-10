<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import Image from '$lib/components/visual/image.svelte';
	import type { Wrestler } from '@prisma/client';

	export let data;
	let activeTab: 'raw' | 'smackdown' = 'raw';
	let roster: { raw: Wrestler[]; smackdown: Wrestler[] } = { raw: [], smackdown: [] };
	const randomDraft = (ev: Event) => {
		ev.preventDefault();
		const form = ev.target as HTMLFormElement;
		const datas = new FormData(form);
		const smackdownCount = parseInt(datas.get('smackdown') as string, 10);
		const rawCount = parseInt(datas.get('raw') as string, 10);

		if (smackdownCount + rawCount > data.elegibleList.length) {
			alert('La suma de luchadores no puede ser mayor que la lista de luchadores elegibles.');
			return;
		}

		const shuffledList = [...data.elegibleList].sort(() => Math.random() - 0.5);
		roster.smackdown = shuffledList.slice(0, smackdownCount);
		roster.raw = shuffledList.slice(smackdownCount, smackdownCount + rawCount);
	};
</script>

<div class="random-draft-container">
	<Box title="Random Draft" classes="random-draft-box" icon="dice-5">
		<form action="" on:submit={randomDraft}>
			<p>Hay disponibles {data.elegibleList.length} luchadores para el draft.</p>
			<p>Elige la distribución por marcas que quieres hacer</p>
			<div class="w1 flex between astart gap-medium">
				<label class="w1 flex column gap-small">
					<span>Smackdown</span>
					<input
						type="number"
						name="smackdown"
						min="0"
						max={data.elegibleList.length}
						value={Math.floor(data.elegibleList.length / 2)}
					/>
				</label>
				<label class="w1 flex column gap-small">
					<span>Raw</span>
					<input
						type="number"
						name="raw"
						min="0"
						max={data.elegibleList.length}
						value={Math.floor(data.elegibleList.length / 2)}
					/>
				</label>

				<button class="btn btn-primary">Random Draft</button>
			</div>
		</form>
	</Box>

	<div class="tabs">
		<div class="tabs-header tab-active-{activeTab}">
			<ul class="tabs-list flex astart gap-small">
				<li class="tab-item relative" class:active={activeTab === 'raw'}>
					<input type="radio" class="app-radio" bind:group={activeTab} value="raw" />
					<a href="#raw">Raw</a>
				</li>
				<li class="tab-item relative" class:active={activeTab === 'smackdown'}>
					<input type="radio" class="app-radio" bind:group={activeTab} value="smackdown" />
					<a href="#smackdown">Smackdown</a>
				</li>
			</ul>
		</div>

		<div class="tab-content-container" class:active={activeTab === 'raw'}>
			<ul class="w1 flex column gap-small">
				{#each roster.raw as wrestler}
					<li class="w1 roster-draft-list-item">
						<Image
							class="h1"
							width="80"
							height="80"
							data-image-src={wrestler.image_name as string}
							src={wrestler.image_name as string}
							alt={wrestler.name}
							type="wrestler"
						/>

						<div class="relative info-block flex astart column nogap">
							<span>{wrestler.name}</span>
							<small>Estado: {wrestler.status}</small>
							<small>Media: {wrestler.overall}</small>
						</div>
					</li>
				{/each}
			</ul>
		</div>

		<div class="tab-content-container" class:active={activeTab === 'smackdown'}>
			<ul class="w1 roster-draft-list">
				{#each roster.smackdown as wrestler}
					<li class="w1 roster-draft-list-item">
						<Image
							class="h1"
							width="80"
							height="80"
							data-image-src={wrestler.image_name as string}
							src={wrestler.image_name as string}
							alt={wrestler.name}
							type="wrestler"
						/>

						<div class="relative info-block flex astart column nogap">
							<span>{wrestler.name}</span>
							<small>Estado: {wrestler.status}</small>
							<small>Media: {wrestler.overall}</small>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	.random-draft-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.random-draft-box {
		width: 100%;
	}

	.tabs {
		width: 100%;
	}

	.tabs-header {
		margin-bottom: 10px;
	}

	.tab-content-container {
		display: none;
	}
	.tabs .tabs-header {
		background-color: #333;
		color: white;
		border-radius: 8px;
		padding: 8px 10px;
	}
	.tabs .tabs-header .tab-item {
		border-radius: 4px;
		padding: 2px 15px;
		text-transform: uppercase;
	}
	.tabs .tabs-header .tab-item.active {
		background-color: #eed;
		color: black;
	}

	.tab-content-container.active {
		display: block;
	}

	.roster-draft-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 10px 0;
	}
	.roster-draft-list-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 4px;
		background-color: #fff;
		overflow: hidden;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
