<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Pagination from '$lib/components/visual/pagination.svelte';
	import { WrestlerConstants } from '$lib/constants/wrestler.constants';

	let selectedStatus = $state('active');
	let { data } = $props();
</script>

<section class="wrestlers-bulk-status-update-page">
	<header class="page-header box flex column gap-0">
		<h1>Cambios de estado</h1>
		<small>Actualiza el estado (activo/inactivo) de múltiples luchadores a la vez.</small>
		<small>
			Selecciona un estado y selecciona los luchadores para actualizar a este nuevo estado a todos
			los luchadores seleccionados en una sola vez.
		</small>

		<label class="form-item down">
			<select name="status" bind:value={selectedStatus}>
				{#each WrestlerConstants.statuses as status}
					<option value={status.value}>{status.label}</option>
				{/each}
			</select>
		</label>
	</header>

	<div class="wrestlers-list-container down">
		<Pagination currentPage={data.page} total={data.total} itemsPerPage={data.perPage} />

		{#if data.wrestlers.length > 0}
			<AsyncForm method="post" reset={true}>
				<input type="hidden" name="_status" value={selectedStatus} />
				<div class="w1 grid wrestlers-grid gap-small responsive">
					{#each data.wrestlers as wrestler}
						<label>
							<div class="wrestler-card" data-id={wrestler.id}>
								<div class="wrestler-avatar image-container">
									<img width="60" src={wrestler.image_name} alt={wrestler.name} />
								</div>
								<h2>{wrestler.name}</h2>
								<small>{wrestler.status}</small>
								<input type="checkbox" name="activeIds" value={wrestler.id} />
							</div>
						</label>
					{/each}
				</div>
			</AsyncForm>
		{:else}
			<p>No hay luchadores disponibles para actualizar.</p>
		{/if}
	</div>
</section>

<style>
	.grid.wrestlers-grid {
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
	}
	.wrestler-card {
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
</style>
