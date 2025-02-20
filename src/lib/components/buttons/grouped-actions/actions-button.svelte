<script lang="ts">
	import Icon from '$lib/components/icons/icon.svelte';
	export let icon: string;
	export let action: string;
	export let method: 'post' | 'get' = 'post';
	export let confirm: boolean = false;
	export let color: 'success' | 'info' | 'danger' | 'warn' = 'info';
</script>

<button
	class="grouped-actions-link {color}"
	type="submit"
	formaction={`?/${action}`}
	formmethod={method}
	formenctype="application/x-www-form-urlencoded"
	data-confirm={confirm}
>
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
