<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import SpinnerLogo from '../spinner/spinner-logo.svelte';
	import { type SubmitFunction } from '@sveltejs/kit';
	import SpinnerSimple from '../spinner/spinner-simple.svelte';
	import { goto } from '$app/navigation';

	export let method: 'post' | 'get' | 'put' | 'delete' = 'post';
	export let action: string = '';
	export let redirect: string = '';
	let loading = false;

	const submitForm: SubmitFunction = ({ formData }) => {
		const redirectURL = formData.has('_redirect') ? formData.get('_redirect')?.toString() : false;
		loading = true;

		return async ({ result, update }) => {
			loading = false;
			const hasSuccess = result.status === 200 && result.type !== 'error';
			if (hasSuccess) await update({ reset: false });

			if (redirectURL && result.status === 200 && result.type !== 'error') {
				console.log('FORM - redirecting to', redirectURL);
				setTimeout(() => {
					goto(redirectURL);
				}, 100);
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
		<div class="loading-wrapper" in:fade out:fade>
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
