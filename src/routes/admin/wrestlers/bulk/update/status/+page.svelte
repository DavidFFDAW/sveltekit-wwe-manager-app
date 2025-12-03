<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import SimplePagination from '$lib/components/visual/simple-pagination.svelte';
	import { WrestlerConstants } from '$lib/constants/wrestler.constants';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let selectedIds: number[] = $state([]);
</script>

<section class="wrestlers-bulk-status-update-page">
	<header class="page-header box flex column gap-0">
		<h1>Cambios de estado</h1>
		<small>Actualiza el estado (activo/inactivo) de múltiples luchadores a la vez.</small>
		<small>
			Selecciona un estado y selecciona los luchadores para actualizar a este nuevo estado a todos
			los luchadores seleccionados en una sola vez.
		</small>
	</header>

	<div class="w1 wrestlers-list-container down">
		<SimplePagination pages={data.pages} current={data.page} />

		{#if data.wrestlers.length > 0}
			<AsyncForm method="post" reset={true} showButtons={false}>
				<div class="w1 grid wrestlers-grid gap-small responsive">
					{#each data.wrestlers as wrestler}
						<label>
							<div class="h1 relative" data-id={wrestler.id}>
								<input
									type="checkbox"
									name="activeIds"
									class="app-radio app-checkbox"
									value={wrestler.id}
									bind:group={selectedIds}
								/>
								<div class="wrestler-card inner">
									<div class="wrestler-avatar image-container">
										<img width="80" src={wrestler.image_name} alt={wrestler.name} use:errorimage />
									</div>

									<div class="wrestler-title">
										<h2>{wrestler.name}</h2>
										<small class="block">{wrestler.status}</small>
									</div>
								</div>
							</div>
						</label>
					{/each}
				</div>

				{#if selectedIds.length > 0}
					<div
						class="w1 flex gap submit-panel buttons-block fixed"
						transition:fade={{ duration: 300 }}
					>
						<div class="w1 pedro-sanxe txapote">
							<select name="new_status">
								{#each WrestlerConstants.statuses as status}
									<option value={status.value}>{status.label}</option>
								{/each}
							</select>
						</div>

						<button type="submit" class="btn cta">Actualizar</button>
					</div>
				{/if}
			</AsyncForm>
		{:else}
			<p>No hay luchadores disponibles para actualizar.</p>
		{/if}
	</div>
</section>

<style>
	.grid.wrestlers-grid {
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}
	.wrestler-card {
		width: 100%;
		height: 100%;
		padding: 1rem;
		border: 1px solid #ccc;
		background-color: #ffffff;
		border-radius: 5px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.submit-panel {
		left: 0;
		bottom: 0;
		background-color: #ffffff;
		border-top: 1px solid #ccc;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 8px 8px 0 0;
		box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
	}
</style>
