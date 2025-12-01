<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import type { PPV } from '@prisma/client';
	import PpvActions from './ppv-actions.svelte';

	export let ppvs: PPV[];
</script>

<div class="ppvs-list resource-list grid">
	{#each ppvs as ppv}
		<div class="ppv-card card relative {ppv.active ? 'active' : 'inactive'}">
			<img
				class="ppv-image"
				width="200"
				height="200"
				loading="lazy"
				src={ppv.image}
				alt={ppv.name}
				data-src={ppv.image}
				data-srcerror="/noimage.jpg"
				draggable="false"
				aria-label={ppv.name}
				use:errorimage
			/>
			<div class="ppv-card-inner flex astart column between gap">
				<div class="w1 datas-block">
					<h4 class="pp-name">{ppv.name} <small>({ppv.abbreviation})</small></h4>
					{#if ppv.game_date}
						<p>
							{ppv.game_date.toLocaleDateString('es-ES', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
							})}
						</p>
					{/if}
					<div class="w1 div flex end ppv-status">
						<span>{ppv.active ? 'Activo' : 'Inactivo'}</span>
					</div>
					<div class="ppv-city">
						<p>{ppv.city}</p>
						<small>{ppv.stadium}</small>
					</div>
				</div>
			</div>
			<div class="w1 flex end absolute top right">
				<PpvActions {ppv} />
			</div>
		</div>
	{/each}
</div>

<style>
	.ppvs-list.resource-list.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}
	.ppv-card {
		width: 100%;
		min-height: 260px;
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}
	.ppv-card .ppv-status span {
		padding: 5px 10px;
		background: #838383;
		color: #fff;
		border-radius: 5px;
		font-weight: 600;
	}
	.ppv-card.active .ppv-status span {
		background: #2e7d32;
	}

	.ppv-card-inner {
		padding: 10px;
	}

	.ppv-card-inner .ppv-city {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		flex-direction: column;
		top: 115px;
		right: 0px;
		font-size: 16px;
		font-weight: 600;
		padding: 5px 10px;
		position: absolute;
		background: #9cfffa;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	}

	.ppv-card-inner .ppv-city small {
		display: block;
		font-size: 10px;
	}

	.ppv-card-inner .ppv-city:after {
		content: '';
		position: absolute;
		top: -6px;
		right: 3px;
		width: 41px;
		height: 28px;
		transform: rotate(15deg);
		background: #223caf;
		z-index: -1;
	}

	img.ppv-image {
		width: 100%;
		height: 150px;
		border-radius: 0 20px 0 0;
		background-color: #000;
		object-fit: contain;
	}

	.ppv-card.inactive img.ppv-image {
		filter: grayscale(1) blur(1px);
	}
</style>
