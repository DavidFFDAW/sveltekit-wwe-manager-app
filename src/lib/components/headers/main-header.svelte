<script lang="ts">
	import { page } from '$app/state';
	import { blur, fade } from 'svelte/transition';
	type BgPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
	interface Props {
		height?: string;
		title?: string;
		links?: boolean;
		background?: string;
		mobileBackground?: string;
		bgPosition?: BgPosition;
		mobileBgPosition?: BgPosition;
		titlePosition?: 'top' | 'center' | 'bottom';
	}

	let {
		height = '350px',
		title = 'Universo WWE',
		links = true,
		background = 'https://media.bleacherreport.com/image/upload/v1688552009/ftzi2nvfvqea8nsoq8fe.jpg',
		mobileBackground = 'https://media.bleacherreport.com/image/upload/v1688552009/ftzi2nvfvqea8nsoq8fe.jpg',
		bgPosition = 'center',
		mobileBgPosition = 'center',
		titlePosition = 'bottom'
	}: Props = $props();

	let path = $derived(page.url.pathname);
</script>

<header
	class="w1 home-page-header main-app-header"
	style="--bg-image: url({background}); --mobile-bg-image: url({mobileBackground}); --header-height: {height}; --bg-position: {bgPosition}; --mobile-bg-position: {mobileBgPosition};"
>
	<div class="header-image-block">
		<div class="w1 header-logo-page-container" style="padding: 0 15px;">
			<img src="/icons/versatile.png" alt="logo" />
		</div>
	</div>
	<div class="w1 flex column gap-smaller">
		<div class="w1 header-title-block title-block-{titlePosition}" style="padding: 0 15px;">
			<h1 class="title dreadnotus">{title}</h1>
		</div>
		{#if links}
			<nav class="w1 thin-home-navigation-menu overflow-horizontal">
				<ul class="w1 flex evenly acenter gap list-style-none">
					<li class="list-item">
						<a href="/">Home</a>
					</li>
					<li class="list-item" class:active={path.startsWith('/pages')}>
						<a href="/pages">Paginas</a>
					</li>
					<li class="list-item" class:active={path.startsWith('/blog')}>
						<a href="/blog">Blog</a>
					</li>
					<li class="list-item" class:active={path.startsWith('/admin')}>
						<a
							href="/admin"
							data-sveltekit-preload-code={false}
							data-sveltekit-preload-data={false}
						>
							Admin
						</a>
					</li>
				</ul>
			</nav>
		{/if}
	</div>
</header>

<style>
	header.home-page-header.main-app-header {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		min-height: var(--header-height);
		background-image: var(--bg-image);
		background-size: cover;
		background-repeat: no-repeat;
		background-position: var(--bg-position);
		width: calc(100% + 30px);
		margin-left: -15px;
		margin-right: -15px;
		margin-top: -15px;
	}
	header.home-page-header.main-app-header .header-image-block img {
		width: 96px;
		height: 96px;
	}
	header.home-page-header.main-app-header h1 {
		font-size: 2.5em;
		color: #fff;
		text-align: start;
		text-transform: uppercase;
		text-shadow:
			-1px -1px 0 #000,
			1px -1px 0 #000,
			-1px 1px 0 #000,
			1px 1px 0 #000;
	}

	header.home-page-header.main-app-header .header-title-block.title-block-center h1 {
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		transform: translateY(-50%);
		text-align: center;
	}
	header.home-page-header.main-app-header nav {
		width: 100%;
		background-color: #001;
		text-transform: uppercase;
		color: #fff;
		padding: 10px 15px;
	}
	header.home-page-header.main-app-header nav ul {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 25px;
	}
	header.home-page-header.main-app-header nav ul li.list-item {
		display: block;
		width: 100%;
		text-align: center;
	}
	/* header.home-page-header.main-app-header nav ul li.list-item:last-child {
		padding-right: 10px;
	} */
	header.home-page-header.main-app-header nav ul li.list-item a {
		display: block;
		position: relative;
		font-family: 'dreadnotus', sans-serif;
	}
	header.home-page-header.main-app-header nav ul li.list-item a:hover {
		color: #f00;
	}
	header.home-page-header.main-app-header nav ul li.list-item.active a::after {
		content: '';
		display: block;
		width: 15%;
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
		height: 3px;
		background-color: #f00;
		border-radius: 50px;
	}

	@media (max-width: 768px) {
		header.home-page-header.main-app-header {
			min-height: 300px;
			background-image: var(--mobile-bg-image);
			background-position: var(--mobile-bg-position);
		}
		header.home-page-header.main-app-header h1 {
			font-size: 2em;
		}
		header.home-page-header.main-app-header nav ul li.list-item.active a::after {
			width: 100%;
		}
	}

	@media screen and (min-width: 1300px) {
		header.home-page-header.main-app-header {
			min-height: 450px;
			background-position: center -100px;
		}
	}
</style>
