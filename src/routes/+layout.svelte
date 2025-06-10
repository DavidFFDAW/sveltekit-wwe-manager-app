<script lang="ts">
	import '../css/global.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
	import 'quill/dist/quill.snow.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import ServiceWorker from '$lib/components/worker/service-worker.svelte';
	import GlobalUtilLinks from './global-admin-links/global-util-links.svelte';

	export let data;
</script>

{#if data.isAdminPage}
	<Sidebar bind:url={data.path} />
{/if}

<main
	class="app-main-entrypoint page-{data.pageRouteSlug} {data.isAdminPage
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

	<ServiceWorker />
	<slot />

	{#if data.userIsAdmin && !data.isAdminPage}
		<GlobalUtilLinks />
	{/if}
</main>
