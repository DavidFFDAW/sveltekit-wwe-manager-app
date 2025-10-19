<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	// /admin\championship-reigns\defences\update
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import NumberInputControls from '$lib/components/forms/inputs/number-input-controls.svelte';
	import { ReignUtils } from '$lib/utils/reign.utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="reigns-defences-update-page">
	<header class="page-header">
		<h1>Actualizar defensas</h1>
		<small>Actualiza la cantidad de defensas de cada título en los reinados actuales.</small>
	</header>

	{#if data.reigns.length > 0}
		<AsyncForm method="post" reset={false} buttonText="Actualizar defensas">
			<div class="grid wrestlers-reigns-grid">
				{#each data.reigns as reign}
					{@const isTagTeam = reign.Championship.tag && reign.Partner !== null}
					{@const name = reign.Partner
						? reign.Team
							? reign.Team.name
							: `${reign.Wrestler.name} & ${reign.Partner.name}`
						: reign.Wrestler.name}
					<input type="hidden" name="reign-id" value={reign.id} />
					<div class="box single-wrestler-reign-card flex column gap-smaller acenter">
						<header class="single-reign-header flex column gap-5">
							<h2 class="w1 block tcenter title wrestler-or-team-name">{name}</h2>
							<small class="w1 block tcenter">{reign.Championship.name}</small>
						</header>
						<div class="wrestler-team-container" class:tag-team={reign.Partner}>
							<img
								class="wrestler-image"
								src={reign.Wrestler.image_name}
								alt={reign.Wrestler.name}
								width={isTagTeam ? '80' : '100'}
								use:errorimage={'/vacant.webp'}
							/>
							{#if reign.Partner}
								<img
									class="wrestler-image"
									src={reign.Partner.image_name}
									alt={reign.Partner.name}
									width={isTagTeam ? '80' : '100'}
									use:errorimage={'/vacant.webp'}
								/>
							{/if}
							<img
								class="championship-image"
								src={reign.Championship.image}
								alt={reign.Championship.name}
								width="100"
								use:errorimage={'/unknown-championship.webp'}
							/>
						</div>

						<NumberInputControls
							label="Defensas"
							name="defenses"
							min={0}
							value={reign.defences}
							step={1}
						/>
						<p class="duration">{ReignUtils.getDaysAndMonths(reign.days)}</p>
					</div>
				{/each}
			</div>
		</AsyncForm>
	{/if}
</section>

<style>
	.grid.wrestlers-reigns-grid {
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}
	.wrestler-team-container {
		position: relative;
	}
	.wrestler-team-container .championship-image {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-15deg);
		width: 100px;
		object-fit: contain;
		opacity: 0.9;
		z-index: 0;
	}
	.wrestler-team-container .wrestler-image {
		position: relative;
		z-index: 1;
	}
	.wrestler-team-container.tag-team {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.box.single-wrestler-reign-card {
		overflow: hidden;
		padding: 10px;
	}
	.box.single-wrestler-reign-card h2.title {
		font-size: 1.2rem;
		margin: 0;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		max-width: 100%;
	}
	.box.single-wrestler-reign-card .duration {
		font-size: 0.9rem;
		color: #666;
	}

	@media only screen and (max-width: 767px) {
		.grid.wrestlers-reigns-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}
	}
</style>
