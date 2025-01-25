<script lang="ts">
	import Icon from '../icons/icon.svelte';

	export let title: string;
	export let icon: string | null = null;
	export let classes = 'default-box';
</script>

<div class="w1 box {classes}">
	{#if title}
		<header class="title-block flex start acenter gap-small pointer">
			{#if icon}
				<Icon {icon} />
			{/if}
			<h2 class="box-title">{title}</h2>
		</header>
	{/if}

	<div class="w1 box-content flex column gap-medium">
		<slot />
	</div>
</div>
