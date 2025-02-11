<script lang="ts">
	export let width: number = 128;
	export let classes: string = '';
	export let brand: string = 'raw';
</script>

<img src="/brands/{brand}.webp" {width} class={classes} alt={brand} />
