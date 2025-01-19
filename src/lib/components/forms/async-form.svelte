<script lang="ts">
	import { enhance } from '$app/forms';
	import SpinnerLogo from '../spinner/spinner-logo.svelte';
	import { type ActionResult, type SubmitFunction } from '@sveltejs/kit';
	import SpinnerSimple from '../spinner/spinner-simple.svelte';
	import { goto } from '$app/navigation';
	import { Toast } from '$lib/utils/toast.helper';

	export let method: 'post' | 'get' | 'put' | 'delete' = 'post';
	export let action: string = '';
	export let redirect: string = '';
	let loading = false;

	const submitForm: SubmitFunction = ({ formData }) => {
		const redirectURL = formData.has('_redirect') ? formData.get('_redirect')?.toString() : false;
		loading = true;

		return async ({ result, update }) => {
			setTimeout(() => {
				loading = false;
			}, 500);
			const response = result as ActionResult & { data: any };
			const hasError = result.type === 'error' || result.type === 'failure';

			if (hasError) {
				const errorMessage =
					response.data?.message ||
					'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.';
				Toast.error(errorMessage);
			}

			const hasSuccess = !hasError && /20\d/g.test(result.status.toString());
			if (hasSuccess) {
				const successMessage = response.data?.message || '¡Operación exitosa!';
				await update({ reset: false });
				Toast.success(successMessage);

				if (redirectURL) goto(redirectURL);
			}
		};
	};
</script>

<form
	action={action ? `?/${action}` : ''}
	class="relative app-custom-form"
	data-method={method}
	method={method === 'get' ? 'get' : 'post'}
	use:enhance={submitForm}
>
	{#if redirect}
		<input type="hidden" name="_redirect" value={redirect} />
	{/if}

	{#if loading}
		<div class="loading-wrapper">
			<SpinnerLogo />
		</div>
	{/if}

	<slot />

	<div class="w1 buttons-block flex">
		<button type="reset" class="btn secondary">Reset</button>
		<button type="submit" class="btn cta" disabled={loading}>
			{#if loading}
				<SpinnerSimple />
			{:else}
				Submit
			{/if}
		</button>
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
