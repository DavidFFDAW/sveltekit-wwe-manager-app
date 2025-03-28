<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Icon from '$lib/components/icons/icon.svelte';
	import { HttpService } from '$lib/services/http.service';
	import { Toast } from '$lib/utils/toast.helper';

	export let href: string;
	export let icon: string;
	export let color: 'success' | 'info' | 'danger' | 'warn' = 'info';
	export let method: 'get' | 'post' | 'put' | 'delete' = 'post';
	export let confirmate: string | boolean = false;
	const defaultConfirmMessage = '¿Estás seguro de que deseas continuar?';

	let loading: boolean = false;
	async function customSubmit(event: Event) {
		event.preventDefault();
		if (loading) return;

		const confirmMessage = typeof confirmate === 'string' ? confirmate : defaultConfirmMessage;
		const proceed = confirmate ? confirm(confirmMessage) : true;
		if (!proceed) return;
		loading = true;

		try {
			const response = await HttpService[method](href);
			const statusMessage = response.ok
				? 'Se ha completado la operación'
				: 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.';
			const message = response.response.message || statusMessage;
			const toaster = response.ok ? Toast.success : Toast.error;
			if (response.ok) invalidateAll();
			toaster(message);
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
