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
	export let showReset: boolean = false;
	export let buttonText: string = 'Submit';
	export let classes: string = 'default-form';
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
	class="relative app-custom-form w1 h1 {classes}"
	data-method={method}
	method={method === 'get' ? 'get' : 'post'}
	use:enhance={submitForm}
>
	<div class="form-inner-content">
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
			{#if showReset}
				<button type="reset" class="btn secondary">Reset</button>
			{/if}
			<button type="submit" class="btn cta uppercase" disabled={loading}>
				{#if loading}
					<SpinnerSimple />
				{:else}
					{buttonText}
				{/if}
			</button>
		</div>
	</div>
</form>

<style>
	form .buttons-block {
		padding: 10px 15px;
	}
	form .buttons-block button {
		width: 100%;
		display: block;
	}

	form.app-custom-form .form-inner-content {
		height: calc(100% - 50px);
		padding: 12px 15px;
	}
	form.app-custom-form .buttons-block {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}
</style>
