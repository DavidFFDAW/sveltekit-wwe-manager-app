<script lang="ts">
	let { data } = $props();
	let upsert = $derived(data.injury_upsert);
</script>

<div class="page-container">
	<div class="box">a</div>
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px 50px 20px;
	}
</style>
