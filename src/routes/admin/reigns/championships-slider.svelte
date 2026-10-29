<script lang="ts">
	import Image from '$lib/components/visual/image.svelte';
	import type { Championship } from '@prisma/client';
	import { onMount } from 'svelte';

	export let championships: Championship[];

	onMount(() => {
		if ('Swiper' in window) {
			const SwiperSlider = window.Swiper as any;
			new SwiperSlider('.swiper-container', {
				slidesPerView: 3,
				spaceBetween: 10,
				navigation: {
					nextEl: '.swiper-container.championships-slider .swiper-button-next',
					prevEl: '.swiper-container.championships-slider .swiper-button-prev'
				}
			});
		}
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
	<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
</svelte:head>

<div class="swiper-container championships-slider">
	<div class="swiper-wrapper championships-slider-wrapper">
		{#each championships as championship}
			<div class="swiper-slide championship-summary-item">
				<a href="#championship-{championship.id}" class="championship-summary-item-link">
					<Image
						src={championship.image}
						alt={championship.name || 'Campeonato'}
						width="80"
						height="80"
						classes="championship-image"
						type="championship"
					/>
					<p>{championship.name}</p>
				</a>
			</div>
		{/each}
	</div>
	<div class="swiper-buttons">
		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>
</div>

<style>
	.championships-slider {
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.championship-summary-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 10px;
		background-color: #fff;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
	}

	.swiper-buttons {
		margin-top: 20px;
		position: static;
		width: 100%;
		display: flex;
		justify-content: space-between;
		z-index: 10;
	}

	.swiper-buttons .swiper-button-prev,
	.swiper-buttons .swiper-button-next {
		position: static;
		left: 0;
		top: 0;
		width: 30px;
		height: 30px;
		background-color: rgba(0, 0, 0, 0.5);
		color: #fff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		z-index: 10;
	}

	.swiper-buttons .swiper-button-prev::after,
	.swiper-buttons .swiper-button-next::after {
		font-size: 13px;
		font-weight: 800;
		color: #fff;
	}
</style>
