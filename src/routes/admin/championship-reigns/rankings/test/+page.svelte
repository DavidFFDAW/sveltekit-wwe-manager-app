<script lang="ts">
	let { data } = $props();
	$inspect(data.ranking);
</script>

<pre>
    {JSON.stringify(data.ranking, null, 5)}
</pre>
