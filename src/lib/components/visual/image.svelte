<script lang="ts">
	const defaultImage = '/noimage.jpg';
	export let src: string | null | null = defaultImage;
	export let alt: string;

	const onError = (event: Event) => {
		const target = event.target as HTMLImageElement;
		target.src = defaultImage;
	};
</script>

<img
	src={src || defaultImage}
	{alt}
	draggable="false"
	role="presentation"
	loading="lazy"
	on:error={onError}
	{...$$restProps}
/>
