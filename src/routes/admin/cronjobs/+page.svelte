<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import ActionsAsync from '$lib/components/buttons/grouped-actions/actions-async.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Icon from '$lib/components/icons/icon.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	export let data;
</script>

<PageWrapper page="admin-cronjobs">
	<h1 class="admin-cronjobs-title">Cronjobs</h1>
	<div class="w1 flex end">
		<GroupedActions text="Acciones de cronjob" position="right">
			<ActionsAsync href="/api/cronjob/refresh-host" method="post" icon="clock">
				Actualizar hosts
			</ActionsAsync>
		</GroupedActions>
	</div>

	{#if data.cronjobs.length > 0}
		<div class="admin-cronjobs-container-list w1 flex column astart gap-medium">
			{#each data.cronjobs as cronjob}
				<div class="admin-cronjob-item w1 cronjob-status-{cronjob.active ? 'active' : 'inactive'}">
					<div class="w1 flex astart gap-small">
						<p class="admin-cronjob-activeness-status">
							<Icon icon={cronjob.active ? 'check-circle-fill' : 'x-circle-fill'} />
						</p>

						<div class="w1 cronjob-content">
							<h3 class="admin-cronjob-item-name">{cronjob.name}</h3>
							<p class="admin-cronjob-item-status">{cronjob.description}</p>

							{#if cronjob.last_executed}
								<p class="admin-cronjob-item-last-run">
									Ultima ejecución:
									<small>
										{cronjob.last_executed.toLocaleDateString('es-ES', {
											year: 'numeric',
											month: '2-digit',
											day: '2-digit',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</small>
								</p>
							{/if}

							<div class="w1 flex end gap-small down">
								<a
									href={`/admin/cronjobs/upsert/${cronjob.slug}`}
									class="admin-cronjob-item-button btn btn-dark"
								>
									<Icon icon="pencil" /> Editar
								</a>

								{#if cronjob.active}
									<AsyncForm
										action="executeCron"
										method="post"
										classes="admin-cronjob-item-form"
										showButtons={false}
									>
										<input type="hidden" name="id" value={cronjob.id} />
										<input type="hidden" name="slug" value={cronjob.slug} />

										<button
											type="submit"
											class="admin-cronjob-item-button btn btn-danger admin-cronjob-item-button btn btn-dark"
										>
											<Icon icon="arrow-clockwise" />
											Ejecutar
										</button>
									</AsyncForm>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<p>No hay trabajos programados.</p>
	{/if}

	<ButtonCreate endpoint="cronjobs/upsert" />
</PageWrapper>

<style>
	:root {
		--color-background: #f9f9f9;
		--color-text: #333;
		--shadow-small: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	.admin-cronjob-item {
		position: relative;
		background-color: var(--color-background);
		padding: 1rem;
		border-radius: 0.5rem;
		box-shadow: var(--shadow-small);
		width: 100%;
		max-width: 400px;
	}
	.admin-cronjob-item.cronjob-status-inactive {
		opacity: 0.8;
	}
	.admin-cronjob-item .admin-cronjob-activeness-status {
		font-size: 1.5rem;
		color: var(--blue);
	}
	.admin-cronjob-item.cronjob-status-inactive .admin-cronjob-activeness-status {
		color: var(--color-text);
		opacity: 0.5;
	}
</style>
