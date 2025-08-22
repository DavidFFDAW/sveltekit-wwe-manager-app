<script lang="ts">
	let width = $$restProps.width || 120;
	const appFallback: string = '/noimage.jpg';
	export let fallback: string = `/vacant.webp`;
	export let alt: string = '';
	export let type: 'wrestler' | 'championship' = 'wrestler';

	const onError = (e: Event) => {
		const target = e.target as HTMLImageElement;
		if (!target) return;
		if (target.tagName !== 'IMG') return;

		if (target.src === fallback) {
			target.src = appFallback;
			return;
		}

		if (target.src !== fallback) {
			const typeFallback = type === 'wrestler' ? '/vacant.webp' : '/unknown-championship.webp';
			target.src = fallback || typeFallback;
		}
	};
</script>

<img
	{...$$restProps}
	{width}
	height={width}
	class="app-image default-image {$$restProps.class}"
	data-fallback={fallback || appFallback}
	data-app-fallback={appFallback}
	on:error={onError}
	loading="lazy"
	aria-label={alt}
/>
