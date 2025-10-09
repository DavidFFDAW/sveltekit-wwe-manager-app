<script lang="ts">
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
</script>

<PageWrapper page="twitter-container">
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
