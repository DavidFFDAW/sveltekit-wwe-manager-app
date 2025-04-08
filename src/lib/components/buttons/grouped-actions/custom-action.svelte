<script lang="ts">
	import Icon from '$lib/components/icons/icon.svelte';

	export let icon: string;
	export let text: string = '';
	export let color: 'success' | 'info' | 'danger' | 'warn' = 'info';
	export let click: () => void = () => {};
</script>

<button class="grouped-actions-link relative {color}" on:click={click}>
	<div class="icon-wrapper">
		<Icon {icon} />
	</div>
	<span class="text">
		{#if text}
			<span>{text}</span>
		{:else}
			<slot></slot>
		{/if}
	</span>
</button>
