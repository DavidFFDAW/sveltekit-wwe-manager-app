<script lang="ts">
	import { page } from '$app/stores';
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
	<slot />
</main>
