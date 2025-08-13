<script lang="ts">
	import type { Championship, ChampionshipReign, Wrestler } from '@prisma/client';
	type ReignWithChampionship = ChampionshipReign & {
		Championship: Championship;
	};

	export let data;
	const wrestler = data.wrestler as Wrestler & { ChampionshipReign: ReignWithChampionship[] };
</script>

<h1 class="w1">Perfil de {wrestler.name}</h1>
<div class="container">
	<div class="box">
		<div class="flex gap">
			<img src={wrestler.image_name} alt={wrestler.name} width="100" />
			<div class="content">
				<h2>{wrestler.name}</h2>
				{#if wrestler.alias}
					<small>{wrestler.alias}</small>
				{/if}
				<p>{wrestler.status}</p>
			</div>
		</div>

		{#if wrestler.ChampionshipReign.length === 0}
			<h2 class="w1">Este luchador no ha ganado ningún campeonato.</h2>
		{:else}
			<section class="wrestler-championship-won-list">
				<h2>Titulos</h2>
				<ul class="grid two-column-grid responsive gap-medium">
					{#each wrestler.ChampionshipReign as reign}
						{@const championship = reign.Championship}
						<li class="w1 flex gap box">
							<img src={championship.image} alt={championship.name} width="80" />
							<div class="championship-info">
								<h3>{championship.name}</h3>
								<p>{reign.days} días</p>
								<p>{reign.won_date.toLocaleDateString()}</p>
								{#if reign.lost_date}
									<p>{reign.lost_date.toLocaleDateString()}</p>
								{/if}
								{#if reign.ppv_won}
									<p>Ganado en PPV: <strong>{reign.ppv_won}</strong></p>
								{/if}
								{#if reign.victory_way}
									<p>Modo de victoria: <strong>{reign.victory_way}</strong></p>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>
</div>
