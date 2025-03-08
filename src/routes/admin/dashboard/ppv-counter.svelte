<script lang="ts">
	import type { PPV } from '@prisma/client';
	import { onDestroy, onMount } from 'svelte';

	let interval: NodeJS.Timeout;
	export let finalDate: Date;
	export let ppv: PPV;
	let timeLeft: { days: number; hours: number; minutes: number; seconds: number } = getTimeLeft();

	function getTimeLeft() {
		const now = Date.now();
		const difference = finalDate.getTime() - now;
		if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

		return {
			days: Math.floor(difference / (1000 * 60 * 60 * 24)),
			hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
			seconds: Math.floor((difference % (1000 * 60)) / 1000)
		};
	}

	onMount(() => {
		interval = setInterval(() => {
			timeLeft = getTimeLeft();
		}, 1000);

		return () => clearInterval(interval);
	});

	onDestroy(() => clearInterval(interval));
</script>

<div class="counter-timer-wrapper flex responsive">
	<div class="ondesktop">
		<h3>Próximo PPV:</h3>
		<h2>{ppv.name}</h2>
	</div>
	<div class="ppv-counter-content flex total">
		{#if timeLeft.days > 0}
			<div class="ppv-counter-content-item">
				<h3>Días</h3>
				<p>{timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}</p>
			</div>
		{/if}
		<div class="ppv-counter-content-item">
			<h3>Horas</h3>
			<p>{timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}</p>
		</div>
		<div class="ppv-counter-content-item">
			<h3>Minutos</h3>
			<p>{timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}</p>
		</div>
		<div class="ppv-counter-content-item">
			<h3>Segundos</h3>
			<p>{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}</p>
		</div>
	</div>

	<div class="ppv-image-container">
		<img src={ppv.image} alt={ppv.name} />
	</div>
</div>

<style>
	.counter-timer-wrapper {
		color: #fff;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(54deg, #000, #333 50%);
		overflow: hidden;
	}
	.counter-timer-wrapper .ppv-counter-content {
		padding: 25px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
	}
	.counter-timer-wrapper .ppv-image-container img {
		max-width: 200px;
	}
	.ppv-counter-content-item p {
		font-size: 2rem;
		font-weight: 700;
		text-transform: uppercase;
		color: #333;
		background-color: #fff;
		padding: 10px;
		border-radius: 10px;
		text-align: center;
		width: auto;
	}
</style>
