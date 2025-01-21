<script lang="ts">
	import { blur } from 'svelte/transition';
	import MainHeader from '$lib/components/headers/main-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';

	let counter: number = 0;
	const addCounter = () => {
		counter += 1;
	};
</script>

<MainHeader
	height="450px"
	bgPosition="top"
	mobileBackground="https://www.usanetwork.com/sites/usablog/files/2023/06/wwe-undertaker-dream-match1.jpg"
/>

<PageWrapper page="home">
	<div class="content">
		<h1>Welcome to SvelteKit</h1>
		<p>
			Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
		</p>

		<p role="presentation" on:click={addCounter}>{counter}</p>
		<a href="/wrestlers">Wrestlers</a>
		<a href="/admin/ppvs">PPVs</a>
	</div>

	<div class="box" in:blur></div>
</PageWrapper>

<style>
	.box {
		width: 100%;
		min-height: 250px;
		background-color: #eee;
	}
</style>
