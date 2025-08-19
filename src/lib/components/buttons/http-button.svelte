<script lang="ts">
	export let href: string;
	export let method: 'get' | 'post' | 'put' | 'delete' = 'get';
	export let icon: string = '';

	let timerInterval: any;
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

	const setRangeTimer = () => {
		timerInterval = setInterval(() => {
			if (range < 90) {
				range += 10; // Increment the range by 10% every second
			}
			if (!loading && range === 90) {
				range += 10;
				clearInterval(timerInterval);

				setTimeout(() => {
					range = 0;
				}, 500);
			}
		}, 100);
	};

	const handleClick = async () => {
		loading = true;
		setRangeTimer();
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
	on:click|preventDefault={handleClick}
>
	{#if icon}
		<i class="bi bi-{icon}"></i>
	{/if}
	<slot></slot>

	<div class="w1 absolute bottom left loader-range" style="width: {range}%;"></div>
</button>

<style>
	.btn {
		background-color: #ccc;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.btn.loading {
		pointer-events: none;
		opacity: 0.7;
	}
	.loader-range {
		background-color: #007bff;
		height: 4px;
	}
</style>
