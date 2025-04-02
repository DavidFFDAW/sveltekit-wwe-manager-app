<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import Icon from '$lib/components/icons/icon.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	export let data;
</script>

<PageWrapper page="admin-cronjobs">
	<h1 class="admin-cronjobs-title">Cronjobs</h1>
	{#if data.cronjobs.length > 0}
		<div class="admin-cronjobs-container-list w1 flex column astart gap-medium">
			{#each data.cronjobs as cronjob}
				<div class="admin-cronjob-item w1">
					<div class="w1 flex astart gap-small">
						<p
							class="admin-cronjob-activeness-status cronjob-status-{cronjob.active
								? 'active'
								: 'inactive'}"
						>
							<Icon icon={cronjob.active ? 'check-circle-fill' : 'x-circle-fill'} />
						</p>

						<div class="w1 cronjob-content">
							<h3 class="admin-cronjob-item-name">{cronjob.name}</h3>
							<p class="admin-cronjob-item-status">{cronjob.description}</p>
							{#if cronjob.last_executed}
								<p class="admin-cronjob-item-last-run">{cronjob.last_executed.toLocaleString()}</p>
							{/if}
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
	.admin-cronjob-item .admin-cronjob-activeness-status {
		font-size: 1.5rem;
		color: var(--blue);
	}
	.admin-cronjob-item .admin-cronjob-activeness-status.cronjob-status-inactive {
		color: var(--color-text);
		opacity: 0.5;
	}
</style>
