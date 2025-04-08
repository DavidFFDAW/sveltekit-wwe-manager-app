<script lang="ts">
	import { enhance } from '$app/forms';
	import SpinnerLogo from '../spinner/spinner-logo.svelte';
	import { type ActionResult, type SubmitFunction } from '@sveltejs/kit';
	import SpinnerSimple from '../spinner/spinner-simple.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { Toast } from '$lib/utils/toast.helper';

	export let method: 'post' | 'get' | 'put' | 'delete' = 'post';
	export let action: string = '';
	export let redirect: string = '';
	export let showButtons: boolean = true;
	export let showReset: boolean = false;
	export let buttonText: string = 'Submit';
	export let classes: string = 'default-form';
	export let showToast: boolean = true;
	export let updateId: string | number = '';
	export let preProcess: ((formData: FormData) => boolean) | null = null;
	export let afterSubmit: ((response: ActionResult) => void) | null = null;
	let loading = false;

	const submitForm: SubmitFunction = ({ formData }) => {
		const redirectURL = redirect.trim();
		loading = true;

		if (preProcess) {
			const shouldSubmit = preProcess(formData);
			if (!shouldSubmit) {
				loading = false;
				Toast.error('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
				return;
			}
		}

		return async ({ result, update }) => {
			setTimeout(() => {
				loading = false;
			}, 500);
			const response = result as ActionResult & { data: any };
			const hasError = result.type === 'error' || result.type === 'failure';
			if (afterSubmit) afterSubmit(response);

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
				await invalidate(''); // Invalidate the current page to refresh the data
				if (showToast) Toast.success(successMessage);

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
	<div class="form-inner-content" class:form-custom-height={showButtons}>
		{#if redirect}
			<input type="hidden" name="_redirect" value={redirect} />
		{/if}
		{#if updateId}
			<input type="hidden" name="_update_id" value={updateId} />
		{/if}

		{#if loading}
			<div class="loading-wrapper">
				<SpinnerLogo />
			</div>
		{/if}

		<slot />

		{#if showButtons}
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
		{/if}
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

	form.app-custom-form .form-inner-content.form-custom-height {
		height: calc(100% - 56px);
		margin-bottom: 56px;
		overflow-x: hidden;
		overflow-y: auto;
	}
	form.app-custom-form .buttons-block {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		z-index: 50;
	}
</style>
