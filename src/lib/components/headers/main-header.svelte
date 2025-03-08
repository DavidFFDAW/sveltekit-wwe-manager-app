<script lang="ts">
	import { goto } from '$app/navigation';
	import { blur, fade } from 'svelte/transition';

	type BgPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

	export let height = '350px';
	export let title: string = 'Universo WWE';
	export let links: boolean = true;
	export let background: string =
		'https://media.bleacherreport.com/image/upload/v1688552009/ftzi2nvfvqea8nsoq8fe.jpg';
	export let mobileBackground: string =
		'https://media.bleacherreport.com/image/upload/v1688552009/ftzi2nvfvqea8nsoq8fe.jpg';
	export let bgPosition: BgPosition = 'center';
	export let mobileBgPosition: BgPosition = 'center';
	export let titlePosition: string = 'bottom';
</script>

<header
	in:fade
	out:blur
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
					<li class="list-item">
						<a href="/pages">Paginas</a>
					</li>
					<li class="list-item">
						<a href="/blog">Blog</a>
					</li>
					<li class="list-item">
						<a href="/twitter">Twitter</a>
					</li>
					<li class="list-item">
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
		gap: 35px;
	}
	header.home-page-header.main-app-header nav ul li.list-item {
		display: block;
		width: 100%;
		text-align: center;
	}
	header.home-page-header.main-app-header nav ul li.list-item:last-child {
		padding-right: 10px;
	}
	header.home-page-header.main-app-header nav ul li.list-item a {
		display: block;
		font-family: 'dreadnotus', sans-serif;
	}
	header.home-page-header.main-app-header nav ul li.list-item a:hover {
		color: #f00;
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
	}

	@media screen and (min-width: 1300px) {
		header.home-page-header.main-app-header {
			min-height: 450px;
			background-position: center -100px;
		}
	}
</style>
