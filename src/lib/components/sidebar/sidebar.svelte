<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { Toast } from '$lib/utils/toast.helper';
	import { SidebarGroups, type SidebarLink } from './sidebar.links';

	let { url }: { url: string } = $props();
	let mobile = $state(false);
	let open = $state(false);
	let expanded = $state<Record<string, boolean>>({});
	let loggingOut = $state(false);
	let panel: HTMLElement;
	let trigger: HTMLButtonElement;
	let closeButton: HTMLButtonElement;
	const pathname = $derived(url.split('?')[0].replace(/\/$/, ''));
	const active = (link: SidebarLink) =>
		link.equals
			? pathname === link.url
			: pathname === link.url || pathname.startsWith(`${link.url}/`);
	const isExpanded = (link: SidebarLink) => expanded[link.url] ?? active(link);

	onMount(() => {
		const query = window.matchMedia('(max-width: 768px)');
		const update = () => {
			mobile = query.matches;
			open = false;
		};
		update();
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	});

	afterNavigate(() => {
		open = false;
		expanded = {};
	});

	$effect(() => {
		if (!mobile || !open) return;
		const previousOverflow = document.body.style.overflow;
		const main = document.querySelector('main.app-main-entrypoint');
		const wasInert = main?.hasAttribute('inert');
		document.body.style.overflow = 'hidden';
		main?.setAttribute('inert', '');
		return () => {
			document.body.style.overflow = previousOverflow;
			if (!wasInert) main?.removeAttribute('inert');
		};
	});

	async function showMenu() {
		open = true;
		await tick();
		closeButton?.focus();
	}
	function closeMenu() {
		open = false;
		trigger?.focus();
	}
	function handleKey(event: KeyboardEvent) {
		if (!mobile || !open) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			closeMenu();
		}
		if (event.key !== 'Tab') return;
		const elements = Array.from(
			panel.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
		);
		const first = elements[0];
		const last = elements[elements.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last?.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first?.focus();
		}
	}

	async function logout() {
		if (loggingOut) return;
		loggingOut = true;
		try {
			const response = await fetch('/api/auth/logout', { method: 'POST' });
			if (!response.ok) throw new Error('Logout failed');
			await goto('/');
		} catch {
			Toast.error('No se ha podido cerrar la sesión. Inténtalo de nuevo.');
		} finally {
			loggingOut = false;
		}
	}
</script>

<svelte:window onkeydown={handleKey} />

<button
	bind:this={trigger}
	class="menu-trigger"
	type="button"
	onclick={showMenu}
	aria-label="Abrir navegación"
	aria-controls="admin-navigation"
	aria-expanded={open}
>
	<i class="bi bi-list" aria-hidden="true"></i><span>Menú</span>
</button>
{#if mobile && open}
	<button
		class="sidebar-backdrop"
		type="button"
		tabindex="-1"
		onclick={closeMenu}
		aria-label="Cerrar navegación"
	></button>
{/if}
<aside
	bind:this={panel}
	id="admin-navigation"
	class="admin-sidebar sidebar"
	class:shown={!mobile || open}
	class:mobile-open={open}
	class:hide={mobile && !open}
	inert={mobile && !open}
	aria-label="Navegación de administración"
>
	<header class="sidebar-header">
		<a class="brand" href="/admin/dashboard" aria-label="Versatile: ir al dashboard">
			<img src="/icons/versatile.png" alt="" width="42" height="42" />
			<span><strong>VERSATILE</strong><small>Panel de administración</small></span>
		</a>
		<button
			bind:this={closeButton}
			class="close-menu"
			type="button"
			onclick={closeMenu}
			aria-label="Cerrar navegación"><i class="bi bi-x-lg" aria-hidden="true"></i></button
		>
	</header>
	<nav class="sidebar-navigation" aria-label="Menú principal">
		{#each SidebarGroups as group, index}
			<section aria-labelledby="nav-group-{index}">
				<h2 id="nav-group-{index}">{group.label}</h2>
				<ul>
					{#each group.links as link}
						<li>
							<div class="nav-row" class:active={active(link)}>
								<a
									href={link.url}
									aria-current={active(link) && !link.submenu ? 'page' : undefined}
									onclick={() => {
										if (mobile) open = false;
									}}
								>
									<i class="bi bi-{link.icon}" aria-hidden="true"></i><span>{link.label}</span>
								</a>
								{#if link.submenu}
									<button
										type="button"
										class="submenu-toggle"
										aria-label="Opciones de {link.label}"
										aria-expanded={isExpanded(link)}
										aria-controls="submenu-{index}-{link.icon}"
										onclick={() => (expanded[link.url] = !isExpanded(link))}
										><i
											class="bi bi-chevron-down"
											class:rotated={isExpanded(link)}
											aria-hidden="true"
										></i></button
									>
								{/if}
							</div>
							{#if link.submenu && isExpanded(link)}
								<ul class="submenu" id="submenu-{index}-{link.icon}">
									{#each link.submenu as child}
										<li>
											<a
												href={child.url}
												class:current={active(child)}
												aria-current={active(child) ? 'page' : undefined}
												onclick={() => {
													if (mobile) open = false;
												}}>{child.label}</a
											>
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</nav>
	<footer class="sidebar-footer">
		<a href="/"><i class="bi bi-box-arrow-up-right" aria-hidden="true"></i> Ver web pública</a>
		<button type="button" onclick={logout} disabled={loggingOut}
			><i class="bi bi-box-arrow-right" aria-hidden="true"></i>{loggingOut
				? 'Cerrando sesión…'
				: 'Cerrar sesión'}</button
		>
	</footer>
</aside>

<style>
	aside.admin-sidebar.sidebar {
		position: fixed;
		inset: 0 auto 0 0;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		width: var(--sidebar-width);
		height: 100dvh;
		background: #15171c;
		color: #d5d8e0;
		border-right: 1px solid #292c34;
	}
	.sidebar-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1.25rem 1rem;
		border-bottom: 1px solid #292c34;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		min-width: 0;
	}
	.brand img {
		flex-shrink: 0;
		object-fit: contain;
	}
	.brand strong {
		display: block;
		color: #fff;
		font-size: 0.95rem;
		letter-spacing: 0.09em;
	}
	.brand small {
		display: block;
		margin-top: 0.35rem;
		font-size: 0.7rem;
		color: #9ba3b3;
	}
	.sidebar-navigation {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 1rem 0.75rem;
		scrollbar-width: thin;
		scrollbar-color: #424754 transparent;
	}
	section + section {
		margin-top: 1.4rem;
	}
	h2 {
		padding: 0 0.75rem;
		margin: 0 0 0.5rem;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #929bad;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li + li {
		margin-top: 0.2rem;
	}
	.nav-row {
		display: flex;
		align-items: center;
		border: 1px solid transparent;
		border-radius: 8px;
	}
	.nav-row > a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
		padding: 0.7rem 0.75rem;
		font-size: 0.88rem;
		font-weight: 500;
	}
	.nav-row > a i {
		font-size: 1rem;
		width: 20px;
		text-align: center;
		color: #929bad;
	}
	.nav-row:hover {
		background: #22252d;
	}
	.nav-row.active {
		background: #351e25;
		border-color: #63303b;
		box-shadow: inset 3px 0 #e2384b;
		color: #fff;
	}
	.nav-row.active > a i {
		color: #ff7483;
	}
	.submenu-toggle {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		padding: 0;
		background: transparent;
		color: inherit;
	}
	.submenu-toggle:hover {
		background: #ffffff12;
	}
	.submenu-toggle i {
		font-size: 0.7rem;
	}
	.rotated {
		transform: rotate(180deg);
	}
	.submenu {
		margin: 0.4rem 0 0.6rem 1.3rem;
		padding-left: 0.75rem;
		border-left: 1px solid #3b404b;
	}
	.submenu a {
		display: block;
		padding: 0.6rem 0.75rem;
		font-size: 0.8rem;
		border-radius: 6px;
		color: #a6afbf;
	}
	.submenu a:hover,
	.submenu a.current {
		color: #fff;
		background: #242831;
	}
	.sidebar-footer {
		padding: 0.75rem;
		padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
		border-top: 1px solid #292c34;
	}
	.sidebar-footer a,
	.sidebar-footer button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.7rem 0.75rem;
		min-height: 42px;
		background: transparent;
		color: #a6afbf;
		text-align: left;
		font-size: 0.8rem;
		border-radius: 7px;
	}
	.sidebar-footer a:hover,
	.sidebar-footer button:hover {
		background: #22252d;
		color: #fff;
	}
	.sidebar-footer button:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	button {
		border: 0;
		cursor: pointer;
	}
	a:focus-visible,
	button:focus-visible {
		outline: 2px solid #ff7483;
		outline-offset: 2px;
	}
	.menu-trigger,
	.close-menu {
		display: none;
	}
	.sidebar-backdrop {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100dvh;
		border-radius: 0;
		background: #080b13b3;
		z-index: 999;
	}
	@media (max-width: 768px) {
		.menu-trigger {
			position: sticky;
			top: 0.75rem;
			z-index: 998;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			margin: 0.75rem;
			min-height: 44px;
			padding: 0.6rem 0.9rem;
			background: #15171c;
			color: #fff;
			border-radius: 8px;
			box-shadow: 0 3px 12px #0002;
		}
		.menu-trigger i {
			font-size: 1.25rem;
		}
		aside.admin-sidebar.sidebar {
			width: min(320px, calc(100vw - 48px));
			visibility: hidden;
			transform: translateX(-100%);
		}
		aside.admin-sidebar.sidebar.mobile-open {
			width: min(320px, calc(100vw - 48px));
			visibility: visible;
			transform: translateX(0);
		}
		.close-menu {
			display: grid;
			place-items: center;
			margin-left: auto;
			flex-shrink: 0;
			width: 40px;
			height: 40px;
			background: transparent;
			color: #d5d8e0;
		}
	}
</style>
