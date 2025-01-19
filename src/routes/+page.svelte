<script lang="ts">
	import MainHeader from '$lib/components/headers/main-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';

	let counter: number = 0;
	const addCounter = () => {
		counter += 1;
	};
</script>

<PageWrapper page="home">
	<MainHeader />

	<h1>Welcome to SvelteKit</h1>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p>

	<p role="presentation" on:click={addCounter}>{counter}</p>
	<a href="/wrestlers">Wrestlers</a>
	<a href="/admin/ppvs">PPVs</a>
</PageWrapper>
