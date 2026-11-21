<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import SpinnerSimple from '../spinner/spinner-simple.svelte';
	import { Toast, Utils } from '$lib/utils';
	import { HttpService } from '$lib/services/http.service';
	import { invalidateAll } from '$app/navigation';

	interface LoadButtonProps extends HTMLButtonAttributes {
		href: string;
		icon?: string;
		sleep?: number;
		method?: 'get' | 'post' | 'put' | 'delete';
		children: Snippet;
	}

	let loading = $state(false);
	let { href, method = 'get', children, icon, sleep = 500, ...rest }: LoadButtonProps = $props();

	const handleClick = async () => {
		if (!href) return;
		loading = true;
		const [response] = await Promise.all([HttpService.request(href, method), Utils.sleep(sleep)]);
		const message: string =
			response.response.message ||
			response.response.error ||
			(response.ok ? 'Operación exitosa' : 'Ocurrió un error');
		const toastMethod = response.ok ? Toast.success : Toast.error;
		if (message) toastMethod.call(null, message);
		if (response.ok) await invalidateAll();
		loading = false;
	};
</script>

<button
	{...rest}
	type="button"
	data-async-button
	data-loading={loading}
	data-href={href}
	class="relative btn async-button {rest.class}"
	class:button-loading={loading}
	class:icon={Boolean(icon)}
	disabled={loading}
	onclick={handleClick}
>
	{#if icon}
		<i class="bi bi-{icon}"></i>
	{/if}
	{#if loading}
		<div class="async-spinner-loading-container">
			<SpinnerSimple />
		</div>
	{/if}

	{@render children()}
</button>

<style>
	.async-button {
		position: relative;
		background-color: #121212;
		border: 1px solid #121212;
		color: #fff;
		border: none;
		padding: 6px 12px;
		border-radius: 4px;
		overflow: hidden;
		text-align: start;
		cursor: pointer;
	}
	.async-button.secondary {
		background-color: #fff;
		color: #121212;
		border: 1px solid #121212;
	}
	.async-button.button-loading {
		opacity: 0.6;
		pointer-events: none;
		user-select: none;
		cursor: wait;
	}
	.async-button:disabled {
		opacity: 0.6;
		pointer-events: none;
		user-select: none;
		cursor: not-allowed;
	}
	.async-button .async-spinner-loading-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.5);
		cursor: not-allowed;
		z-index: 1;
	}
</style>
