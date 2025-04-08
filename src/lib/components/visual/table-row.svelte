<script lang="ts">
	import Actions from '../buttons/grouped-actions/actions.svelte';

	export let label: string;
	export let actions: boolean = false;
</script>

<td data-label={label} {...$$restProps} data-tab={actions ? 'actions' : label}>
	{#if actions}
		<Actions>
			<slot />
		</Actions>
	{:else}
		<slot />
	{/if}
</td>
