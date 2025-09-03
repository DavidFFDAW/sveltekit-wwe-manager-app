<script>
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Seo from '$lib/components/seo/seo.svelte';
</script>

<PageWrapper page="twitter-container">
	<Seo title="Twitter" description="Últimas noticias y actualizaciones de Twitter" />

	<div class="twitter-page-container-layout">
		<slot />
	</div>
</PageWrapper>

<style>
	.twitter-page-container-layout {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;
	}
</style>
