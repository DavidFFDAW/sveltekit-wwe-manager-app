<script lang="ts">
	import { enhance } from '$app/forms';
	import { customEnhance } from './custom.enhance';

	export let method: 'post' | 'get' | 'put' | 'delete' = 'post';
	export let action: string = '';
	export let redirect: string = '';
	export let classes: string = 'simple-async-default-form';
	export let updateId: string | number = '';
	export let afterSubmit: () => void = () => {};
</script>

<form
	action={action ? `?/${action}` : ''}
	class="relative app-custom-form {classes}"
	data-method={method}
	method={method === 'get' ? 'get' : 'post'}
	use:enhance={customEnhance(afterSubmit)}
>
	<div class="form-inner-content">
		{#if redirect}
			<input type="hidden" name="_redirect" value={redirect} />
		{/if}
		{#if updateId}
			<input type="hidden" name="_update_id" value={updateId} />
		{/if}
		<slot />
	</div>
</form>
