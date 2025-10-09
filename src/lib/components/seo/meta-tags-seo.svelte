<script lang="ts">
	import { DEFAULT_METAS } from '$lib/constants/metas.constants';

	export let page: Record<string, any>;
	let title: string = '';

	$: metas = page.metas ? { ...DEFAULT_METAS, ...page.metas } : DEFAULT_METAS;
	$: title = metas.title || page.pagetitle;
</script>

<svelte:head>
	<title>{title} | WWE-2K</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content={metas.description} />
	<meta name="keywords" content={metas.keywords} />
	<meta name="author" content={metas.author} />
	<meta name="robots" content={metas.robots} />

	<!-- canonical -->
	<link rel="canonical" href={page.canonical} />

	<!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
	<meta property="og:title" content={metas.ogTitle || title} />
	<meta property="og:description" content={metas.ogDescription || metas.description} />
	<meta property="og:image" content={metas.ogImage || metas.image} />
	<meta property="og:url" content={metas.canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="es_ES" />

	<!-- Twitter Cards -->
	<meta name="twitter:title" content={metas.twTitle || title} />
	<meta name="twitter:description" content={metas.twDescription || metas.description} />
	<meta name="twitter:image" content={metas.twImage || metas.image} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@wwemanager" />
	<meta property="twitter:domain" content={metas.canonical} />
	<meta property="twitter:url" content={metas.canonical} />

	<meta name="theme-color" content="#000000" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="format-detection" content="telephone=no" />

	<meta http-equiv="x-ua-compatible" content="IE=edge" />

	<!-- Schema.org -->
	{@html `  <script type="application/ld+json">{
     "@context": "https://schema.org",
     "@type": "Website",
     "name": "${title}",
     "url": "${metas.canonical}",
     "logo": "${metas.image}"  }</script>`}
</svelte:head>
