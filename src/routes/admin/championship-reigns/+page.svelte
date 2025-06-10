<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Image from '$lib/components/visual/image.svelte';

	export let data = { reigns: [] };
</script>

<PageWrapper page="championship-reigns">
	{#if data.reigns.length === 0}
		<div class="w1 flex center">
			<p>No hay reinados de campeonatos registrados.</p>
		</div>
	{:else}
		<div class="grouped-championship-reigns">
			{#each data.reigns as [championshipId, reigns]}
				<h2 data-championship-id={championshipId} class="w1 tcenter">
					{reigns[0].Championship.name}
				</h2>

				<ul class="w1 championship-reigns-list">
					{#each reigns as reign}
						{@const isTag = reign.Partner && reign.Championship.tag}
						<li class="w1 championship-reign-item">
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

								<p><strong>Ganado: </strong>{reign.won_date}</p>
								{#if reign.lost_date}
									<p><strong>Perdido: </strong>{reign.lost_date}</p>
								{/if}
								<p><strong>Dias: </strong>{reign.days}</p>

								<div class="w1 flex end acenter gap-smaller">
									<a href="/admin/championship-reigns/update/{reign.id}" class="btn cta icon">
										<i class="bi bi-pencil"></i>
										<span class="btn-text">Editar</span>
									</a>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	{/if}

	<ButtonCreate endpoint="/championship-reigns/create" />
</PageWrapper>

<style>
	:root {
		--background-color: #f9f9f9;
		--box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.grouped-championship-reigns {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.championship-reigns-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.championship-reign-item {
		background-color: var(--background-color);
		border-radius: 0.5rem;
		padding: 1rem;
		box-shadow: var(--box-shadow);
	}

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
</style>
