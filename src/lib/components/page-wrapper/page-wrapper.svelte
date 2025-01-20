<script lang="ts">
	import { fade, blur } from 'svelte/transition';
	import Footer from '../footer/footer.svelte';
	export let page: string;
	import { page as route } from '$app/state';
</script>

<section class="w1 h1 page page-{page}-wrapper" in:fade out:blur>
	<div class="page-padding page-wrapper-content">
		<slot />
	</div>

	{#if route.route.id && !route.route.id.startsWith('/admin')}
		<Footer />
	{/if}
</section>
