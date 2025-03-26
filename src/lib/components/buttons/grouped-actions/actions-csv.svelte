<script lang="ts">
	import Icon from '$lib/components/icons/icon.svelte';
	import { HttpService } from '$lib/services/http.service';
	import { Toast } from '$lib/utils/toast.helper';

	export let href: string;
	export let icon: string;
	export let downloadName: string;
	export let color: 'success' | 'info' | 'danger' | 'warn' = 'info';
	let loading: boolean = false;

	async function customSubmit(event: Event) {
		event.preventDefault();
		if (loading) return;
		loading = true;

		try {
			const response = await HttpService.get(href);
			const toaster = response.ok ? Toast.success : Toast.error;
			if (!response.ok) toaster('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');

			const csvContent = response.response.csv;
			const blob = new Blob([csvContent], { type: 'text/csv' });
			const urlBlob = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = urlBlob;
			a.download = downloadName;
			a.click();

			URL.revokeObjectURL(urlBlob);
			a.remove();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}
</script>

<button
	class="grouped-actions-link relative {color}"
	class:is-loading={loading}
	on:click={customSubmit}
>
	{#if loading}
		<div class="grouped-actions-spinner-container">
			<span class="grouped-actions-spinner"></span>
		</div>
	{/if}
	<div class="icon-wrapper">
		<Icon {icon} />
	</div>
	<span class="text">
		<slot></slot>
	</span>
</button>

<style>
	.grouped-actions-link {
		min-width: 200px;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 5px;
		color: white;
		text-decoration: none;
		color: #000;
		cursor: pointer;
	}

	.grouped-actions-link.is-loading .grouped-actions-spinner-container {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.grouped-actions-link.is-loading .grouped-actions-spinner {
		display: block;
		border: 3px solid rgba(0, 0, 0, 0.2);
		border-top-color: rgba(0, 0, 0, 0.9);
		border-radius: 50%;
		width: 1.5rem;
		height: 1.5rem;
		animation: spin 1s linear infinite;
	}

	.grouped-actions-link.is-loading {
		pointer-events: none;
	}
	.grouped-actions-link.is-loading .icon-wrapper,
	.grouped-actions-link.is-loading .text {
		opacity: 0.5;
	}
	.grouped-actions-link.warn {
		color: #b8a122;
	}

	.grouped-actions-link .icon-wrapper {
		display: flex;
		align-items: center;
		padding: 0.5rem;
		border-radius: 50%;
	}

	.grouped-actions-link.success .icon-wrapper {
		background-color: var(--color-success);
		color: #53655a;
	}

	.grouped-actions-link.info .icon-wrapper {
		background-color: var(--color-info);
		color: #31708f;
	}

	.grouped-actions-link.danger .icon-wrapper {
		background-color: var(--color-danger);
		color: #a94442;
	}

	.grouped-actions-link.warn .icon-wrapper {
		background-color: var(--color-warn);
		color: #deac16;
	}

	.grouped-actions-link .text {
		flex: 1;
		display: block;
		text-align: start;
	}
</style>
