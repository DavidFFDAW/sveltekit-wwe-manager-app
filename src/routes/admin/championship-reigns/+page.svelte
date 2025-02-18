<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';

	export let data = { reigns: [] };
</script>

<PageWrapper page="championship-reigns">
	<section class="w1 flex column gap-medium">
		<h1>Reinados de campeonato</h1>
		<div class="w1 flex center gap-medium column box">
			{#each data.reigns as reign}
				<div class="w1 flex column gap-medium">
					<h2>{reign.Championship.name}</h2>
					<div class="w1 flex center gap-medium">
						<img
							width="120"
							src={reign.Wrestler.image_name}
							alt={reign.Wrestler.name}
							class="h1"
							use:errorimage
						/>

						{#if reign.Partner}
							<div class="w1 flex column gap-medium">
								<h3>{reign.Partner.name}</h3>
								<img
									width="120"
									src={reign.Partner.image_name}
									alt={reign.Partner.name}
									class="h1"
									use:errorimage
								/>
							</div>
						{/if}

						<div class="w1 flex column gap-small">
							<h3>{reign.Wrestler.name}</h3>
							<p><strong>Ganado: </strong>{reign.won_date}</p>
							{#if reign.lost_date}
								<p><strong>Perdido: </strong>{reign.lost_date}</p>
							{/if}
							<p><strong>Dias: </strong>{reign.days}</p>
						</div>

						<div class="w1 flex center gap-medium">
							<a href="/admin/championship-reigns/update/{reign.id}" class="btn cta">Editar</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<ButtonCreate endpoint="/championship-reigns/create" />
</PageWrapper>
