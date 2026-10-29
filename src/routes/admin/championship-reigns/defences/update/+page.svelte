<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	// /admin\championship-reigns\defences\update
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import NumberInputControls from '$lib/components/forms/inputs/number-input-controls.svelte';

	let { data }: { data: { reigns: any[] } } = $props();
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
					<input type="hidden" name="reign-id" value={reign.id} />
					<div class="box single-wrestler-reign-card flex column gap-smaller acenter">
						<header class="single-reign-header flex column gap-5">
							<h2 class="w1 block tcenter title wrestler-or-team-name">{reign.calculated_name}</h2>
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
							value={reign.defences || 0}
							step={1}
						/>
						<p class="duration">{reign.time_days}</p>
						{#if reign.ellapsed_time}
							<p class="elapsed-time">Actualizado: {reign.ellapsed_time.formatted}</p>
						{/if}

						<p class="tag reign-rating-tag">{reign.ranking_status}</p>
					</div>
				{/each}
			</div>
		</AsyncForm>
	{/if}
</section>

<style>
	.grid.wrestlers-reigns-grid {
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}
	.wrestler-team-container {
		position: relative;
	}
	.wrestler-team-container .wrestler-image {
		width: 150px;
		object-fit: contain;
	}
	.wrestler-team-container .championship-image {
		position: absolute;
		left: 50%;
		bottom: -20px;
		transform: translateX(-50%);
		object-fit: contain;
		width: 100px;
		opacity: 1;
		filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.5));
		z-index: 2;
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
		position: relative;
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

	.tag.reign-rating-tag {
		position: absolute;
		top: 10px;
		right: 10px;
		display: inline-block;
		padding: 2px 16px;
		background-color: #27355d;
		border-radius: 25px;
		font-size: 12px;
		color: #fff;
	}

	/* @media only screen and (max-width: 767px) {
		.grid.wrestlers-reigns-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}
	} */
</style>
