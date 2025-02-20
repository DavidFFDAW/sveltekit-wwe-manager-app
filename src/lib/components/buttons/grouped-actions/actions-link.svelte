<script lang="ts">
	import Icon from '$lib/components/icons/icon.svelte';
	export let href: string;
	export let icon: string;
	export let color: 'success' | 'info' | 'danger' | 'warn' = 'info';
</script>

<a {href} class="grouped-actions-link {color}">
	<div class="icon-wrapper">
		<Icon {icon} />
	</div>
	<span class="text">
		<slot></slot>
	</span>
</a>

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
