<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Image from '$lib/components/visual/image.svelte';
	import type { ChampionshipReign } from '@prisma/client';

	let update = false;
	export let isTag: boolean = false;
	export let reign: ChampionshipReign & {
		Wrestler: { image_name: string; name: string };
		Partner?: { image_name: string; name: string };
		Championship: { image: string; name?: string; tag?: boolean };
		won_date_str: string;
		lost_date_str: string;
		team_name: string;
		days_month: string;
	};
</script>

<AsyncForm showButtons={false} method="post" updateId={reign.id}>
	<div class="championship-reign-item-image-container" class:tag-team={isTag}>
		<Image
			src={reign.Wrestler.image_name}
			alt={reign.Wrestler.name}
			width="120"
			height="120"
			classes="championship-image"
		/>

		{#if reign.Partner && reign.Championship.tag}
			<Image
				src={reign.Partner.image_name}
				alt={reign.Partner.name}
				width="120"
				height="120"
				classes="championship-image"
			/>
		{/if}
	</div>

	<div class="w1 championship-reign-details-content">
		<h3 class="w1 tcenter">{reign.team_name}</h3>

		<div class="championship-reign-championship-image-container">
			<Image
				src={reign.Championship.image}
				alt={reign.Championship.name || 'Campeonato'}
				width="80"
				height="80"
				classes="championship-image"
				type="championship"
			/>
		</div>

		<div class="championship-reign-statistics">
			<div class="championship-reign-stats-item">
				<p class="championship-reign-stats-title">Ganado</p>
				{#if !update}
					<p class="championship-reign-stats-value">{reign.won_date_str}</p>
				{:else}
					<label class="championship-reign-stats-title">
						<input type="date" name="won_date" value={reign.won_date.toISOString().split('T')[0]} />
					</label>
				{/if}
			</div>

			<div class="championship-reign-stats-item">
				<p class="championship-reign-stats-title">Perdido</p>
				{#if !update}
					<p class="championship-reign-stats-value">{reign.lost_date_str || 'No registrado'}</p>
				{:else}
					<label class="championship-reign-stats-title">
						<input
							type="date"
							name="lost_date"
							value={reign.lost_date?.toISOString().split('T')[0] || ''}
						/>
					</label>
				{/if}
			</div>

			<div class="championship-reign-stats-item">
				<p class="championship-reign-stats-title">Días</p>
				<p class="championship-reign-stats-value">{reign.days}</p>
			</div>

			<div class="championship-reign-stats-item">
				<p class="championship-reign-stats-title">Tiempo</p>
				<p class="championship-reign-stats-value">{reign.days_month}</p>
			</div>

			<div class="championship-reign-stats-item">
				<p class="championship-reign-stats-title">Defensas</p>
				{#if !update}
					<p class="championship-reign-stats-value">{reign.defences}</p>
				{:else}
					<label class="championship-reign-stats-title">
						<input type="number" name="defences" value={reign.defences} />
					</label>
				{/if}
			</div>

			<div class="championship-reign-stats-item">
				<p class="championship-reign-stats-title">Modo victoria</p>
				{#if !update}
					<p class="championship-reign-stats-value">
						{reign.victory_way || 'No registrado'}
					</p>
				{:else}
					<label class="championship-reign-stats-title">
						<input type="text" name="victory_way" value={reign.victory_way || 'No registrado'} />
					</label>
				{/if}
			</div>

			<div class="championship-reign-stats-item">
				<p class="championship-reign-stats-title">Evento</p>
				{#if !update}
					<p class="championship-reign-stats-value">
						{reign.ppv_won || 'No registrado'}
					</p>
				{:else}
					<label class="championship-reign-stats-title">
						<input type="text" name="ppv_won" value={reign.ppv_won || 'No registrado'} />
					</label>
				{/if}
			</div>
		</div>

		<div class="w1 flex between gap-small">
			<button type="button" on:click={() => (update = !update)}>
				{update ? 'Cancelar' : 'Actualizar'}
			</button>

			{#if update}
				<button type="submit" class="btn cta" disabled={!update}>
					<i class="bi bi-check"></i>
					<span class="btn-text">Guardar</span>
				</button>
			{/if}
		</div>

		<!-- <div class="w1 flex end acenter gap-smaller">
			<a href="/admin/championship-reigns/update/{reign.id}" class="btn cta icon">
				<i class="bi bi-pencil"></i>
				<span class="btn-text">Ir a panel de edición</span>
			</a>
		</div> -->
	</div>
</AsyncForm>

<style>
	.championship-reign-item-image-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.championship-reign-championship-image-container {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0.8rem 0;
	}
	.championship-reign-item-image-container.tag-team {
		flex-direction: row;
	}

	.championship-reign-details-content {
		display: flex;
		flex-direction: column;
		align-items: start;
		margin-top: 0.5rem;
	}

	.championship-reign-statistics {
		width: 100%;
		display: flex;
		flex-direction: column;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		overflow: hidden;
		margin-bottom: 1rem;
	}
	.championship-reign-statistics .championship-reign-stats-item {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		background-color: #fff;
		border-bottom: 1px solid #ddd;
	}
	.championship-reign-statistics .championship-reign-stats-item:last-child {
		border-bottom: none;
	}

	.championship-reign-statistics .championship-reign-stats-item .championship-reign-stats-title {
		font-weight: bold;
		color: #333;
		border-right: 1px solid #ddd;
	}

	.championship-reign-statistics .championship-reign-stats-item .championship-reign-stats-value {
		color: #555;
	}
	.championship-reign-statistics .championship-reign-stats-item .championship-reign-stats-title,
	.championship-reign-statistics .championship-reign-stats-item .championship-reign-stats-value {
		padding: 0.5rem;
	}
	.championship-reign-statistics input {
		width: 100%;
		padding: 0 4px;
		border: none;
		border-radius: 0;
		background-color: transparent;
		border-bottom: 1px solid #ddd;
		font-weight: 600;
	}
</style>
