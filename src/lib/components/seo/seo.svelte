<script lang="ts">
	import { page } from '$app/state';

	export let title = 'App';
	export let description: string | null =
		'Gestión completa de WWE Universe Mode en WWE2K: luchadores, campeonatos, reinados, equipos, PPVs, draft, blog, editor de imágenes y más en un solo lugar';
	export let image: string | null = '/icons/maskable.png';
	export let robots: string = 'index, follow';
	const website = 'https://wwe-manager-app.vercel.app';

	const date = new Date();
	const yearLastTwoDigits = date.getFullYear().toString().slice(-2);
</script>

<svelte:head>
	<title>{title} | WWE-2K</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<!-- Diseño responsive -->
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="WWE, Universe Mode, eventos WWE, PPV, lucha libre, wwe 2k, wwe manager, manager, wwe 2k{yearLastTwoDigits}"
	/>
	<meta name="author" content="David Fernández" />
	<meta name="robots" content={robots} />

	<!-- canonical -->
	<link rel="canonical" href={page.url.toString()} />

	<!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
	<meta property="og:title" content="WWE 2K Manager" />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:url" content="{website}{page.url.pathname}" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="es_ES" />
	<!-- Cambia según idioma -->

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="WWE 2K Manager" />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:site" content="@wwemanager" />
	<meta property="twitter:domain" content={website} />
	<meta property="twitter:url" content="{website}{page.url.pathname.toString()}" />

	<meta name="theme-color" content="#000000" />
	<!-- Personaliza el color en móviles -->
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<!-- Hace la web progresiva (PWA) -->
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="format-detection" content="telephone=no" />

	<meta http-equiv="x-ua-compatible" content="IE=edge" />

	<!-- Insert extra meta tags here -->
	<slot />

	<!-- Schema.org -->
	{@html `  <script type="application/ld+json">{
     "@context": "https://schema.org",
     "@type": "Website",
     "name": "${title}",
     "url": "${website}${page.url.pathname}",
     "logo": "${image}"  }</script>`}
</svelte:head>
