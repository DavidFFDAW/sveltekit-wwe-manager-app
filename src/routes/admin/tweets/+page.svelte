<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
</script>

<h1>Página tweets</h1>
<a href="upsert" class="btn small info">
	<i class="bi bi-plus"></i>
	<span class="sp">Nuevo Tweet</span>
</a>

<ButtonCreate endpoint="tweets/upsert" />

<style></style>
