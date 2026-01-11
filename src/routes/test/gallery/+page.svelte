<script lang="ts">
	import FullGallery from "$lib/components/gallery/full-gallery.svelte";
    let value = $state<string>('');
</script>

<img src="{value}" alt="Imagen seleccionada" width="200" />
<FullGallery bind:value={value} />