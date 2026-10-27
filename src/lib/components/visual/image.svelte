<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import type { HTMLImgAttributes } from 'svelte/elements';

	interface ImageProps extends HTMLImgAttributes {
		fallback?: string;
	}

	let { fallback = '/vacant.webp', ...rest }: ImageProps = $props();
	const appFallback: string = '/noimage.jpg';
</script>

<img
	{...rest}
	width={rest.width || 120}
	height={rest.width || 120}
	class="app-image default-image {rest.class}"
	data-fallback={fallback || appFallback}
	data-app-fallback={appFallback}
	aria-label={rest.alt || ''}
	use:errorimage={fallback}
	loading="lazy"
/>
