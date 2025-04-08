<script lang="ts">
	import Icon from '$lib/components/icons/icon.svelte';
	import { fade } from 'svelte/transition';

	export let shown = false;
	const toggle = () => {
		shown = !shown;
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (event.target instanceof HTMLElement && !event.target.closest('.small-actions-container')) {
			shown = false;
		}
	};
</script>

<svelte:window on:click={handleClickOutside} />

<div class="small-actions-container">
	<button type="button" class="small-btn" on:click={toggle}>
		<Icon icon="three-dots-vertical" />
	</button>
	{#if shown}
		<div class="small-actions" transition:fade={{ duration: 200 }}>
			<slot />
		</div>
	{/if}
</div>

<style>
	:root {
		--color-white: #ffffff;
		--color-gray-200: #e0e0e0;
		--shadow-1: 0 2px 4px rgba(0, 0, 0, 0.1);
		--border-radius-1: 4px;
	}

	.small-actions-container {
		position: relative;
		display: block;
	}

	.small-actions {
		position: absolute;
		top: 100%;
		right: 0;
		background-color: var(--color-white);
		box-shadow: var(--shadow-1);
		border-radius: var(--border-radius-1);
		z-index: 10;
	}

	.small-btn {
		display: block;
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		box-shadow: var(--shadow-1);
	}

	.small-btn:hover {
		background-color: var(--color-gray-200);
	}
</style>
