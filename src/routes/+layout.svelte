<script lang="ts">
	import {page} from '$app/stores';

	const getRoute = (route: string | null) => {
		if (!route) return 'non-page';
		if (route === '/') return 'home';
		return route.slice(1).replace(/\//gi, '-');
	}
	
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
</svelte:head>

<main class="page-{getRoute($page.route.id)}">
	<slot />
</main>