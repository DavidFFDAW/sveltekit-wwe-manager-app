<script>
	import { fade } from 'svelte/transition';
</script>

<div class="spinner">
	<div class="spinenr"></div>
</div>

<style>
	:root {
		--spinner-size: 20px;
	}
	.spinner {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spinenr {
		min-width: var(--spinner-size);
		min-height: var(--spinner-size);
		border: 5px solid #f3f3f3;
		border-top: 5px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		z-index: 0;
	}
</style>
