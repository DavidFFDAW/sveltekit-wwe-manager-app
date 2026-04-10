<script lang="ts">
	import '../css/global.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
	import 'quill/dist/quill.snow.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import ServiceWorker from '$lib/components/worker/service-worker.svelte';
	import GlobalUtilLinks from './global-admin-links/global-util-links.svelte';
	import { page } from '$app/state';
	import MetaTagsSeo from '$lib/components/seo/meta-tags-seo.svelte';
	import { AnalyticsHelpers } from './api/analytics/track/analytics.helper';

	let { data, children } = $props();

	const handleLinkClick = (event: Event) => {
		if (data.isAdminPage) return;
		const target = event.target as HTMLElement;
		const link = target.closest('a');
		if (!link) return;

		const href = link.href;
		const url = new URL(href);
		const path =
			url.hostname !== data.hostname ? url.href : url.pathname + url.searchParams.toString();

		// if (path.startsWith('admin') || path.startsWith('/admin')) return;
		AnalyticsHelpers.track('link_click', path);
	};

	$effect(() => {
		if (!data.isAdminPage) AnalyticsHelpers.track('pageview', page.url.pathname);

		document.addEventListener('click', handleLinkClick);
		return () => {
			document.removeEventListener('click', handleLinkClick);
		};
	});
</script>

<MetaTagsSeo page={page.data} />

{#if data.isAdminPage}
	<Sidebar url={data.path} />
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
	{@render children()}

	{#if data.userIsAdmin && !data.isAdminPage}
		<GlobalUtilLinks />
	{/if}
</main>
