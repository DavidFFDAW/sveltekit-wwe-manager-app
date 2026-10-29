<script lang="ts">
	import type { PPV } from '@prisma/client';
	import { onMount } from 'svelte';

	let { finalDate, ppv }: { finalDate: Date; ppv: PPV } = $props();
	let now = $state<number | null>(null);
	const remaining = $derived(now === null ? null : Math.max(0, finalDate.getTime() - now));
	const units = $derived([
		{ label: 'Días', value: Math.floor((remaining ?? 0) / 86400000) },
		{ label: 'Horas', value: Math.floor(((remaining ?? 0) % 86400000) / 3600000) },
		{ label: 'Minutos', value: Math.floor(((remaining ?? 0) % 3600000) / 60000) },
		{ label: 'Segundos', value: Math.floor(((remaining ?? 0) % 60000) / 1000) }
	]);
	const dateFormat = new Intl.DateTimeFormat('es-ES', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Europe/Madrid'
	});
	onMount(() => {
		now = Date.now();
		const interval = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => clearInterval(interval);
	});
</script>

<section class="ppv-banner" aria-labelledby="next-ppv-title">
	<div class="event">
		{#if ppv.image}<div class="artwork"><img src={ppv.image} alt="" /></div>{/if}
		<div class="event-copy">
			<p class="eyebrow"><span aria-hidden="true"></span>Próximo PPV</p>
			<h2 id="next-ppv-title">{ppv.name}</h2>
			<time datetime={finalDate.toISOString()}
				>{dateFormat.format(finalDate)} <span class="timezone">(Madrid)</span></time
			>
		</div>
	</div>
	<div class="countdown">
		<p class="countdown-caption">
			{remaining === 0 ? 'El evento ya ha comenzado' : 'Nos vemos en el ring en'}
		</p>
		<div class="timer" role="timer" aria-label="Tiempo restante para el próximo PPV">
			{#each units as unit}
				<div class="unit">
					<span class="number"
						>{remaining === null ? '—' : String(unit.value).padStart(2, '0')}</span
					>
					<span class="unit-label">{unit.label}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.ppv-banner {
		container-type: inline-size;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 28px 40px;
		width: 100%;
		padding: clamp(20px, 3vw, 36px);
		position: relative;
		overflow: hidden;
		border: 1px solid #ffffff14;
		border-radius: 0 0 16px 16px;
		background: radial-gradient(ellipse at 0 0, #7a1e2b55, transparent 65%), #17181c;
		color: #fff;
		box-shadow: 0 8px 24px #00000014;
	}
	.ppv-banner::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 4px;
		background: #c91727;
	}
	.event {
		display: flex;
		align-items: center;
		gap: 24px;
		flex: 1 1 340px;
		min-width: 0;
	}
	.artwork {
		display: grid;
		place-items: center;
		flex: 0 0 112px;
		height: 120px;
	}
	.artwork img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 6px 12px #0005);
	}
	.event-copy {
		min-width: 0;
	}
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 0 10px;
		color: #f3adb5;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}
	.eyebrow span {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #ed5363;
	}
	h2 {
		margin: 0 0 10px;
		font-size: clamp(1.6rem, 3vw, 2.4rem);
		font-weight: 800;
		line-height: 1.1;
		text-wrap: balance;
		overflow-wrap: anywhere;
	}
	time {
		display: block;
		color: #c3c3cb;
		font-size: 0.85rem;
		line-height: 1.5;
	}
	.timezone {
		color: #a2a2ae;
		white-space: nowrap;
	}
	.countdown {
		flex: 0 1 340px;
		min-width: 0;
	}
	.countdown-caption {
		margin: 0 0 12px;
		color: #c3c3cb;
		font-size: 0.8rem;
		text-align: center;
	}
	.timer {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
	}
	.unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		min-width: 0;
	}
	.number {
		display: block;
		width: 100%;
		padding: 15px 6px;
		border: 1px solid #ffffff18;
		border-radius: 10px;
		background: linear-gradient(#ffffff0d, #ffffff04);
		font-size: 2.25rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: 1;
		text-align: center;
	}
	.unit-label {
		color: #b1b1be;
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	@container (max-width: 740px) {
		.event {
			flex-basis: 100%;
		}
		.countdown {
			flex-basis: 100%;
			padding-top: 20px;
			border-top: 1px solid #ffffff14;
		}
		.timer {
			max-width: 400px;
			margin-inline: auto;
		}
	}
	@container (max-width: 400px) {
		.event {
			gap: 16px;
		}
		.artwork {
			flex-basis: 72px;
			height: 88px;
		}
		h2 {
			font-size: 1.5rem;
		}
		time {
			font-size: 0.75rem;
		}
		.number {
			font-size: 1.8rem;
			padding-block: 13px;
		}
		.timer {
			gap: 6px;
		}
	}
</style>
