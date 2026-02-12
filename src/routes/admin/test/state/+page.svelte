<script lang="ts">
	import { createTestState } from './page.svelte';
	let { count, derived, input, increment, decrement } = createTestState({});
</script>

<p>{count}</p>
<p>{derived}</p>
<button class="btn" on:click={increment}>Increment</button>
<button class="btn" on:click={decrement}>Decrement</button>

<input type="text" bind:value={input} placeholder="Type something..." />
