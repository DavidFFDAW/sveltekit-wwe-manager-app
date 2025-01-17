<script lang="ts">
	import { enhance } from '$app/forms';

	export let method: 'post' | 'get' | 'put' | 'delete' = 'post';
	export let action: string = '';
	export let redirect: string = '';
</script>

<form {action} data-method={method} method={method === 'get' ? 'get' : 'post'} use:enhance>
	{#if redirect}
		<input type="hidden" name="_redirect" value={redirect} />
	{/if}

	<slot />

	<div class="w1 buttons-block flex">
		<button type="reset" class="btn secondary">Reset</button>
		<button type="submit" class="btn cta">Submit</button>
	</div>
</form>

<style>
	form .buttons-block {
		padding: 10px;
	}
	form .buttons-block button {
		width: 100%;
		display: block;
	}
</style>
