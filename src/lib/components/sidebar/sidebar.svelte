<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Icon from '../icons/icon.svelte';
	import { goto } from '$app/navigation';
	import { SidebarLinks } from './sidebar.links';

	export let url: string;
	let isMobile = browser ? window.innerWidth < 600 : false;
	let showSidebar = browser ? window.innerWidth > 600 : true;

	const handleResize = () => {
		isMobile = window.innerWidth < 600;
		showSidebar = window.innerWidth > 600;
	};

	onMount(() => {
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	const afterClick = (ev: Event) => {
		const target = ev.target as HTMLElement;
		if (isMobile && !target.classList.contains('has-submenu')) showSidebar = false;
	};

	const logout = async (event: Event) => {
		event.preventDefault();
		const response = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok && isMobile) showSidebar = false;
		if (response.ok && response.status === 200) goto('/');
	};
</script>

<aside
	class="admin-sidebar h1 sidebar {isMobile ? 'mobile-sidebar' : 'desktop-sidebar'} {showSidebar
		? 'shown'
		: 'hide'}"
	data-url={url}
>
	<div class="sidebar-container-wrapper flex column gap-small">
		<div class="dashboard">
			<a href="/admin/dashboard" class="block w1 flex center acenter">
				<img src="/icons/versatile.png" alt="logo" width="144" height="144" />
			</a>
		</div>

		<div class="w1 links-container-block flex center">
			<ul class="w1 flex column gap-smaller link-items-list">
				<li on:click={afterClick} role="presentation">
					<a href="/">Home</a>
				</li>

				{#each SidebarLinks as link}
					<li
						class:has-submenu={link.submenu && link.submenu.length > 0}
						class:active={link.equals ? url === '/admin/dashboard' : url.startsWith(link.url)}
						on:click={afterClick}
						role="presentation"
					>
						<a href={link.url}> {link.label}</a>
						{#if link.submenu}
							<ul class="w1 flex column gap-5">
								{#each link.submenu as sublink}
									<li
										data-real-url={sublink.url}
										data-suburl={sublink.url}
										data-startWith={url.startsWith(sublink.url)}
										data-equals={url === sublink.url}
										data-is-eq={sublink.equals}
										class:active={sublink.equals
											? url === sublink.url
											: url.startsWith(sublink.url)}
										on:click={afterClick}
										role="presentation"
									>
										<a href={sublink.url}> {sublink.label}</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}

				<li class="w1">
					<button type="button" class="w1 tstart" on:click={logout}>Logout</button>
				</li>
			</ul>
		</div>
	</div>

	<button class="btn sidebar-toggle-btn" on:click={() => (showSidebar = !showSidebar)}>
		<Icon icon={showSidebar ? 'x' : 'list'} />
	</button>
</aside>

<style>
	.links-container-block {
		padding: 0 20px;
	}
	.links-container-block li {
		width: 100%;
	}
	.links-container-block button {
		background-color: transparent;
		border: none;
	}

	.links-container-block a,
	.links-container-block button {
		display: block;
		font-size: 16px;
		color: #fff;
		cursor: pointer;
		padding: 6px 20px;
		border-radius: 10px;
		font-family: 'dreadnotus';
		text-transform: uppercase;
	}

	.links-container-block li.active a,
	.links-container-block a:hover,
	.links-container-block button:hover {
		background: #c91727;
		background: linear-gradient(140deg, #c91727, #1f1f1f);
	}
	.links-container-block li.has-submenu ul li a {
		background: #1f1f1f;
	}
	.links-container-block li.has-submenu ul li.active a {
		background: #c91727;
		background: linear-gradient(140deg, #c91727, #1f1f1f);
	}

	.sidebar-toggle-btn {
		display: none;
	}

	.links-container-block li.has-submenu {
		position: relative;
	}
	.links-container-block li.has-submenu.active > a {
		border-radius: 10px 10px 0 10px;
	}
	.links-container-block li.has-submenu ul {
		display: none;
		padding: 8px 16px;
		margin-left: 20px;
		width: calc(100% - 20px);
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 0 0 10px 10px;
	}
	.links-container-block li.has-submenu:hover ul {
		display: flex;
	}
	.links-container-block li.has-submenu ul li a {
		font-size: 13px;
	}

	.link-items-list {
		/* --image: 144px;
		--gap: 15px;
		--padding: 10px; */
		max-height: calc(100vh - (144px + 15px + 15px));
		overflow-y: auto;
	}

	@media only screen and (max-width: 768px) {
		aside.admin-sidebar.sidebar.shown {
			width: 100%;
		}
		aside.sidebar.hide {
			position: fixed;
			transform: translateX(-100%);
			z-index: 16;
		}
		aside.sidebar.shown {
			min-height: 100%;
			opacity: 1;
			width: 100%;
			transform: translateX(0);
		}
		aside.sidebar .sidebar-toggle-btn {
			display: block;
			position: absolute;
			top: 0;
			right: 0;
			background: #c91727;
			color: #fff;
			border: none;
			border-radius: 0;
			padding: 5px;
			font-size: 18px;
			cursor: pointer;
		}

		aside.sidebar.hide .sidebar-toggle-btn {
			transform: rotate(0) translateX(100%);
		}

		.links-container-block li.has-submenu > a {
			pointer-events: none;
		}
	}
</style>
