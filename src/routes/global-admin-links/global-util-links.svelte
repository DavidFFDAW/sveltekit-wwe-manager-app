<script lang="ts">
	import { slide } from 'svelte/transition';
	import { SidebarLinks } from '$lib/components/sidebar/sidebar.links';

	let opened = false;
	const closeOpenedLinksMenu = () => {
		if (opened) {
			opened = false;
		}
	};
</script>

<div class="global-admin-links-app" class:opened>
	{#if opened}
		<ul class="links-menu" transition:slide>
			{#each SidebarLinks as link}
				<li class="link-item">
					<a href="/{link.url}" class="btn icon" on:click={closeOpenedLinksMenu}>
						<i class="bi bi-{link.icon ? link.icon : 'gear'}"></i>
						<span>{link.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}

	<button type="button" class="btn btn-primary btn-open-list" on:click={() => (opened = !opened)}>
		<i class="bi bi-gear"></i> Gestionar
	</button>
</div>

<style>
	.global-admin-links-app {
		display: block;
		position: fixed;
		bottom: 20px;
		left: 20px;
		z-index: 1000;
	}
	.global-admin-links-app .btn-open-list {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 15px;
		background-color: #1b5797;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.global-admin-links-app.opened .btn-open-list {
		border-radius: 0 0 8px 8px;
	}
	.global-admin-links-app ul.links-menu {
		position: relative;
		display: flex;
		flex-direction: column;
		max-height: 300px;
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 12px 12px 0 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border: 1px solid #5885b6;
	}
	.global-admin-links-app ul.links-menu li a {
		display: flex;
		justify-content: flex-start;
		gap: 8px;
		padding: 10px 15px;
		color: #333;
		background-color: #d8e7f1;
		text-decoration: none;
		border-radius: 0;
	}
</style>
