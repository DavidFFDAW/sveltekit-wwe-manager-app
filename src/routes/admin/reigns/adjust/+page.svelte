<script lang="ts">
	import Image from '$lib/components/visual/image.svelte';

	let selectedIds: number[] = [];
	export let data;
</script>

<header class="fixed fixed-header flex end acenter">
	<button class="btn icon btn-submit cta">
		<i class="bi bi-arrow-repeat"></i>
		<span>Actualizar todos</span>
	</button>
</header>

<div class="championship-reigns-adjust-page">
	<ul class="current-championship-reigns-list">
		{#each data.reigns as reign}
			<li class="current-championship-reign-item" class:selected={selectedIds.includes(reign.id)}>
				<Image
					src={reign.Wrestler.image_name}
					alt={reign.Wrestler.name}
					width="100"
					height="100"
					classes="championship-image"
				/>
				<div class="championship-reign-details-content">
					<p><strong>Campeonato:</strong> {reign.Championship.name}</p>
					<p><strong>Luchador:</strong> {reign.Wrestler.name}</p>
					<p><strong>Fecha de inicio:</strong> {reign.won_date.toLocaleDateString('es-ES')}</p>
					<p>
						<strong>Fecha de fin:</strong>
						{reign.lost_date ? reign.lost_date.toLocaleDateString('es-ES') : 'Actual'}
					</p>
					<div class="days-calculations" class:wrong={reign.calculated_days !== reign.days}>
						<p><strong>Reinado:</strong> {reign.days}</p>
						<p><strong>Días calculados:</strong> {reign.calculated_days}</p>
					</div>
				</div>

				<div class="w1 flex end acenter">
					<button type="button" class="btn btn-info icon relative">
						<input
							type="checkbox"
							class="app-checkbox"
							name="selected[]"
							value={reign.id}
							bind:group={selectedIds}
						/>
						{#if selectedIds.includes(reign.id)}
							<i class="bi bi-check2"></i>
						{:else}
							<i class="bi bi-plus"></i>
						{/if}

						<span class="btn-text">
							{selectedIds.includes(reign.id) ? 'Deseleccionar' : 'Seleccionar'}
						</span>
					</button>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	header.fixed-header {
		position: fixed;
		width: 100%;
		top: 0;
		background-color: #fff;
		z-index: 1000;
		padding: 1rem;
		border-bottom: 1px solid #ddd;
	}
	.championship-reigns-adjust-page {
		padding: 1rem;
	}

	.current-championship-reigns-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.current-championship-reign-item {
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 1rem;
	}
	.current-championship-reign-item.selected {
		background-color: #e0f7fa;
		border-color: #00acc1;
	}
	.championship-reign-details-content p {
		margin: 0.25rem 0;
	}

	.days-calculations {
		color: #333;
		font-weight: bold;
	}

	.days-calculations.wrong {
		color: #ff0000;
	}
</style>
