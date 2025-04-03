<script lang="ts">
	import { blur, fade } from 'svelte/transition';
	import { SidebarLinks } from '../sidebar/sidebar.links';
	import Icon from '../icons/icon.svelte';
</script>

<header in:fade out:blur class="w1 home-page-header main-app-header">
	<nav class="navigation overflow-horizontal">
		<ul class="navigation-list flex evenly acenter gap list-style-none">
			{#each SidebarLinks as link}
				<li class="navigation-list-item">
					<a href={link.url} class="navigation-list-item-link" class:has-icon={link.icon}>
						{#if link.icon}
							<Icon icon={link.icon} classes="icon-big" />
						{/if}
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	header.home-page-header.main-app-header {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		min-height: var(--header-height);
		background-image: var(--bg-image);
		background-size: cover;
		background-repeat: no-repeat;
		background-position: var(--bg-position);
		width: calc(100% + 30px);
		margin-left: -15px;
		margin-right: -15px;
		margin-top: -15px;
	}
</style>
