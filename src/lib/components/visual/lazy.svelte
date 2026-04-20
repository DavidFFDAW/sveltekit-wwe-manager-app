<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		children,
		threshold = 0.1,
		rootMargin = '0px'
	}: { children: Snippet; threshold?: number; rootMargin?: string } = $props();

	let el: HTMLDivElement;
	let visible = $state(false);

	$effect(() => {
		if (!el) return;
		if (typeof IntersectionObserver === 'undefined') {
			visible = true;
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold, rootMargin: rootMargin }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div bind:this={el}>
	{#if visible}{@render children()}{/if}
</div>
