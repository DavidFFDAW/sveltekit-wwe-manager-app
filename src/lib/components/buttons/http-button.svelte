<script lang="ts">
	import { fade } from 'svelte/transition';

	export let href: string;
	export let method: 'get' | 'post' | 'put' | 'delete' = 'get';
	export let icon: string = '';

	let showButtonRange: boolean = false;
	let range: number = 0;
	let loading = false;

	const sendRequest = () => {
		const options: RequestInit = {
			method: method.toUpperCase(),
			headers: {
				'Content-Type': 'application/json'
			}
		};
		if (['post', 'put'].includes(method)) {
			options.body = JSON.stringify({}); // Add your request body here
		}

		return fetch(href, options);
	};

	const handleClick = async () => {
		loading = true;
		showButtonRange = true;
		try {
			const response = await sendRequest();
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const jsoned = await response.json();
			console.log(jsoned);
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
			range = 100;

			setTimeout(() => {
				showButtonRange = false;
				range = 0;
			}, 250);
		}
	};
</script>

<button
	type="button"
	class="http-button relative btn {$$restProps.class}"
	data-method={method}
	data-endpoint={href}
	disabled={loading}
	class:loading
	class:has-range={showButtonRange}
	on:click|preventDefault={handleClick}
>
	{#if loading}
		<div class="loading-spinner-container" transition:fade>
			<div class="spinner"></div>
		</div>
	{/if}

	<div class="inner-button-container">
		{#if icon}
			<i class="bi bi-{icon}"></i>
		{/if}
		<slot></slot>
	</div>

	{#if showButtonRange}
		<div
			class="w1 absolute bottom left loader-range"
			class:completed={range === 100}
			transition:fade
		></div>
	{/if}
</button>

<style>
	.loading-spinner-container {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 6px;
		margin: 0;
		top: 0;
		left: 0;
		z-index: 10;
	}
	.loading-spinner-container .spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-top: 4px solid #007bff;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		animation: spin 1s linear infinite;
	}

	.btn.http-button {
		background-color: #ccc;
		overflow: hidden;
	}
	.btn.http-button.has-range {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.http-button.btn.loading {
		cursor: not-allowed;
		pointer-events: none;
		opacity: 0.8;
	}
	.btn.loading .inner-button-container {
		opacity: 0.2;
	}
	.http-button.btn:disabled {
		/* opacity: 1; */
		background-color: rgba(204, 204, 204, 0.3);
		color: #272727;
	}
	.loader-range {
		height: 4px;
		border-radius: 0 6px 6px 6px;
		background-color: #007bff;
		transform-origin: left;
		animation: rangeAnimation 1s forwards ease-in-out;
	}
	.http-button .loader-range.completed {
		width: 100% !important;
		border-radius: 0 0 6px 6px;
	}

	@keyframes rangeAnimation {
		0% {
			width: 0;
		}
		100% {
			width: 95%;
		}
	}
</style>
