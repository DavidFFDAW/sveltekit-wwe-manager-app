<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import ActionsAsync from '$lib/components/buttons/grouped-actions/actions-async.svelte';
	import ActionsCsv from '$lib/components/buttons/grouped-actions/actions-csv.svelte';
	import ActionsLink from '$lib/components/buttons/grouped-actions/actions-link.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import Pagination from '$lib/components/visual/pagination.svelte';
	import { WrestlerConstants } from '$lib/constants/wrestler.constants.js';
	export let data = { wrestlers: [], search: '', total: 0, page: 1 };
</script>

<div class="admin-page-wrapper admin-wrestlers padding">
	<form action="/admin/wrestlers" method="get">
		<div class="flex search-wrapper">
			<input type="search" name="search" placeholder="Search..." bind:value={data.search} />
			<button type="submit">Search</button>
		</div>
	</form>

	<div class="w1 flex end">
		<GroupedActions text="Acciones de luchadores" position="right">
			<ActionsLink href="/admin/wrestlers/create" icon="plus" color="success">
				Crear luchador
			</ActionsLink>
			<ActionsCsv
				href="/api/export/csv/wrestlers?separator=;"
				downloadName="wrestlers-{Date.now()}.csv"
				icon="file-earmark-arrow-down"
			>
				Exportar CSV
			</ActionsCsv>
			<ActionsAsync href="/api/wrestler/slug/refresh" method="post" icon="arrow-clockwise">
				Regenerar slugs de luchadores
			</ActionsAsync>
		</GroupedActions>
	</div>

	<div class="w1 flex between gap-small responsive down">
		<h1 class="uppercase">Wrestlers</h1>
		<Pagination total={data.total} itemsPerPage={10} bind:currentPage={data.page} />
	</div>

	<div class="admin-wrestlers-list flex column gap-smaller down">
		{#if data.wrestlers.length > 0}
			{#each data.wrestlers as wrestler}
				<div class="w1 flex gap-medium admin-wrestler-card responsive">
					<div class="w1 flex gap-small astart responsive">
						<img use:errorimage src={wrestler.image_name} alt={wrestler.name} width="100" />

						<div class="w1 admin-wrestler-card-info gap-0">
							<h2>{wrestler.name}</h2>
							<small>{wrestler.slug}</small>
							<div class="status-quick-change-action-block">
								<AsyncForm
									action="updateStatus"
									updateId={wrestler.id}
									method="put"
									showButtons={false}
								>
									<div class="flex nogap responsive">
										<select name="status" bind:value={wrestler.status}>
											{#each WrestlerConstants.statuses as status}
												<option value={status.value}>{status.label}</option>
											{/each}
										</select>

										<button type="submit" class="w1 btn">Actualizar</button>
									</div>
								</AsyncForm>
							</div>
						</div>
					</div>

					<div class="wrestler-actions responsive-w1">
						<a
							href="/admin/wrestlers/update/{wrestler.id}"
							class="block tcenter btn secondary blue responsive-w1"
						>
							Editar
						</a>
					</div>
				</div>
			{/each}
		{:else}
			<p>No wrestlers found</p>
		{/if}
	</div>

	<ButtonCreate endpoint="wrestlers/create" />
</div>

<style>
	.search-wrapper {
		margin-bottom: 1rem;
	}

	.search-wrapper input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		width: 100%;
	}

	.search-wrapper button {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #f9f9f9;
		margin-left: 1rem;
		cursor: pointer;
	}

	.admin-wrestler-card {
		padding: 5px;
		display: flex;
		background-color: #f9f9f9;
		border-radius: 5px;
		overflow: hidden;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.admin-wrestler-card .admin-wrestler-card-info {
		padding: 6px 0;
	}

	.status-quick-change-action-block {
		max-width: 220px;
	}
	.status-quick-change-action-block select {
		border-radius: 5px 0 0 5px;
		height: 40px;
	}
	.status-quick-change-action-block .btn {
		border-radius: 0 5px 5px 0;
		height: 40px;
		padding: 0;
		background-color: #415972;
		color: white;
	}

	@media only screen and (max-width: 768px) {
		.admin-wrestlers-list {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20px;
			align-items: start;
		}
		.admin-wrestler-card img {
			width: 100%;
		}

		.admin-wrestler-card .admin-wrestler-card-info h2 {
			white-space: pre;
			overflow-y: hidden;
			overflow-x: auto;
			padding: 0 5px;
			max-width: 100%;
		}
		.admin-wrestler-card .admin-wrestler-card-info h2::-webkit-scrollbar {
			display: none;
		}
		.status-quick-change-action-block {
			max-width: 100%;
		}
		.status-quick-change-action-block select {
			border-radius: 5px 5px 0 0;
		}
		.status-quick-change-action-block .btn {
			border-radius: 0 0 5px 5px;
		}
	}
</style>
