<script lang="ts">
	import '../css/global.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
	import 'quill/dist/quill.snow.css';
	import { page } from '$app/stores';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';

	const getRoute = (route: string | null) => {
		if (!route) return 'non-page';
		if (route === '/') return 'home';
		return route
			.slice(1)
			.replace(/\//gi, '-')
			.replace(/[\(\)\$\?\&\`\'\"]/gi, '');
	};

	$: adminPage = $page.route.id?.startsWith('/admin');
</script>

<svelte:head>
	<title>WWE 2K Universo</title>
	<meta name="robots" content="noindex nofollow" />
</svelte:head>

{#if adminPage}
	<Sidebar bind:url={$page.route.id as string} />
{/if}

<main
	class="app-main-entrypoint page-{getRoute($page.route.id)} {adminPage
		? 'admin-page'
		: 'public-page'}"
>
	<SvelteToast
		options={{
			duration: 4000,
			initial: 40,
			intro: { y: 250 },
			dismissable: true,
			classes: ['wwe-app-toast', 'custom-toast']
		}}
	/>
	<slot />
</main>
