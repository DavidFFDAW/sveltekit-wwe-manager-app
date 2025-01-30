<script lang="ts">
	import { slide } from 'svelte/transition';
	import { page as route } from '$app/state';
	import Footer from '../footer/footer.svelte';

	export let page: string;
	export let showFooter: boolean = true;
</script>

<section class="w1 h1 page page-{page}-wrapper" transition:slide>
	<div class="page-padding page-wrapper-content">
		<slot />
	</div>

	{#if route.route.id && !route.route.id.startsWith('/admin') && showFooter}
		<Footer />
	{/if}
</section>
