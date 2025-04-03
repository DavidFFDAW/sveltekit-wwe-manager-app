<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import { fade } from 'svelte/transition';

	export let defaultImage = '/noimage.jpg';
	export let src: string | null | null = defaultImage;
	export let alt: string;
	export let width: number | string = 80;
	export let height: number | string = 80;
	export let classes: string = 'default-image';
</script>

<img
	src={src || defaultImage}
	{alt}
	{width}
	{height}
	class={classes}
	draggable="false"
	role="presentation"
	loading="lazy"
	transition:fade
	use:errorimage={defaultImage}
	aria-label={alt}
	{...$$restProps}
/>
