<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<div class="spinner-overlay-layer" in:fade out:fade>
	<div class="spinner spinner-logo pulse">
		<img src="/icons/versatile.png" alt="app main icon" />
	</div>
</div>

<style>
	.spinner-overlay-layer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spinner-overlay-layer .spinner.pulse {
		animation: pulse 1.5s infinite;
	}

	.spinner-overlay-layer .spinner img {
		width: 100px;
		height: 100px;
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
