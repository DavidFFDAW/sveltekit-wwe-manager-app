<script lang="ts">
	import { page } from '$app/state';
</script>

{#if page.error}
	<h1>{page.error.message}</h1>
	<pre>{JSON.stringify(page.error, null, 4)}</pre>
{/if}
