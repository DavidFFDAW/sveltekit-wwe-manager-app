<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import SpinnerSimple from '../spinner/spinner-simple.svelte';
	import { Toast, Utils } from '$lib/utils';
	import { HttpService } from '$lib/services/http.service';

	interface LoadButtonProps extends HTMLButtonAttributes {
		href: string;
		method?: 'get' | 'post' | 'put' | 'delete';
		children: Snippet;
	}

	let loading = $state(false);
	let { href, method = 'get', children, ...rest }: LoadButtonProps = $props();

	const handleClick = async () => {
		if (!href) return;

		loading = true;
		const response = await HttpService.request(href, method);
		const message = response.response.error || '';
		console.log({ load: response });
		if (message) Toast.info(message);
		loading = false;
	};
</script>

<button
	{...rest}
	type="button"
	data-async-button
	data-loading={loading}
	class="relative async-button {rest.class}"
	class:button-loading={loading}
	disabled={loading}
	onclick={handleClick}
>
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
		border-radius: 8px;
		overflow: hidden;
		text-align: start;
		cursor: pointer;
	}
	.async-button.button-loading {
		opacity: 0.6;
		pointer-events: none;
		user-select: none;
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
