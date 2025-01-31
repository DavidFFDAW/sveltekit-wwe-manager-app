<script lang="ts">
	import SpinnerLogo from '../spinner/spinner-logo.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { Toast } from '$lib/utils/toast.helper';

	let loading = false;
	export let action: string = '';
	export let redirect: string = '';
	export let classes: string = 'default-http-form';
	export let method: 'post' | 'get' | 'put' | 'delete' = 'post';

	const sendRequest = async (action: string, method: string, formData: FormData) => {
		const response = await fetch(action, {
			method: method.toUpperCase(),
			body: formData,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		return {
			response,
			content: await response.json()
		};
	};

	const showError = (error: string) => {
		loading = false;
		Toast.error(error);
	};

	const customSubmit = async (event: Event) => {
		event.preventDefault();
		if (!action) return Toast.error('No action provided');

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const redirectURL = redirect.trim();
		loading = true;

		const { response, content } = await sendRequest(action, method, formData);
		if (!response.ok)
			return showError(
				content.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'
			);

		loading = false;
		await invalidate(''); // Invalidate the current page to refresh the data
		Toast.success(content.message || '¡Operación exitosa!');
		if (redirectURL) {
			setTimeout(() => {
				goto(redirectURL);
			}, 800);
		}
	};
</script>

<form
	{action}
	data-method={method}
	class="relative app-http-form {classes}"
	method={method === 'get' ? 'get' : 'post'}
	on:submit|preventDefault={customSubmit}
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
</form>
