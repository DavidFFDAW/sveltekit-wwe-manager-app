<div class="spinner-overlay-layer">
	<div class="spinner spinner-logo pulse">
		<img src="/icons/versatile.png" alt="app main icon" />
	</div>
</div>

<style>
	:root {
		--spinner-image-size: 200px;
	}
	.spinner-overlay-layer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999999;
	}

	.spinner-overlay-layer .spinner.pulse {
		animation: pulse 1.5s infinite;
	}

	.spinner-overlay-layer .spinner img {
		width: var(--spinner-image-size);
		height: var(--spinner-image-size);
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(1.1);
		}

		100% {
			transform: scale(1);
		}
	}
</style>
