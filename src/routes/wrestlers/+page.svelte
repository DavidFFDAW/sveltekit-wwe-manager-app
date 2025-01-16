<script>
	export let data;	
</script>

{#each data.wrestlers as wrestler}
	<p>{wrestler.name}</p>
{/each}