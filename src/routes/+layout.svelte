<script lang="ts">
	import { page } from '$app/stores';
	const isAdmin = $page.route.id?.startsWith('/admin');
	import '../css/global.css';

	const getRoute = (route: string | null) => {
		console.log(route);

		if (!route) return 'non-page';
		if (route === '/') return 'home';
		return route
			.slice(1)
			.replace(/\//gi, '-')
			.replace(/[\(\)\$\?\&\`\'\"]/gi, '');
	};
</script>

<svelte:head>
	<title>WWE 2K Universo</title>
	<meta name="robots" content="noindex nofollow" />
</svelte:head>

<main class="app-main-entrypoint page-{getRoute($page.route.id)}">
	{#if isAdmin}
		<aside class="app-sidebar sidebar show">
			<a href="/admin">
				<img src="/icons/versatile.png" alt="WWE 2K Universo" />
			</a>

			<nav>
				<ul>
					<li>
						<a href="/admin/ppvs">PPVs</a>
					</li>
					<li>
						<a href="/admin/roster">Roster</a>
					</li>
					<li>
						<a href="/admin/championships">Championships</a>
					</li>
				</ul>
			</nav>
		</aside>
	{/if}

	<slot />
</main>
