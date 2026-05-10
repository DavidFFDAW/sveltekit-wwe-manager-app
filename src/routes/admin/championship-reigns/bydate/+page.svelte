<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';
	let { data } = $props();
</script>

<form action="" method="get" class="w1 box flex column gap-medium">
	<input
		type="date"
		name="date"
		value={data.reigns.currentDateISO}
		min={data.reigns.minDateISO}
		max={data.reigns.maxDateISO}
	/>
	<button type="submit" class="btn icon cta" style="align-self: flex-end;">
		<i class="bi bi-funnel"></i>
		<span>Filter</span>
	</button>
</form>

<div style="margin-top: 40px;">
	<h2>
		Hay {data.reigns.currentDateReigns.length} resultados para el {data.reigns.currentDateFormatted}
	</h2>

	<div class="grid grid-reigns">
		{#each data.reigns.currentDateReigns as reign}
			<div class="card">
				<header class="card-header">
					<img
						width="140"
						src={reign.championship.image}
						alt={reign.championship.name}
						use:errorimage={data.statics.championship}
					/>
					<p>{reign.championship.name}</p>
				</header>
				<div class="card-body">
					<p><strong>Campeón:</strong> {reign.wrestler.name}</p>
					{#if reign.partner.id}
						<p><strong>Compañero:</strong> {reign.partner.name}</p>
					{/if}
					{#if reign.team}
						<p><strong>Equipo:</strong> {reign.team}</p>
					{/if}
					<p><strong>Fecha de inicio:</strong> {reign.formatted_won_date}</p>
					<p>
						<strong>Fecha de fin:</strong>
						{reign.formatted_lost_date ? reign.formatted_lost_date : '--'}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.grid.grid-reigns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		margin-top: 10px;
		gap: 15px;
	}
	.grid.grid-reigns .card {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 12px;
		padding: 10px;
		gap: 10px;
	}

	.grid.grid-reigns .card header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
</style>
