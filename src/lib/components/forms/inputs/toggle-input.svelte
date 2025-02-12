<script lang="ts">
	export let name: string;
	export let label: string;
	export let checked = false;
	export let disabled = false;
</script>

<div class="toggle-container form-item form-input-toggle-switch">
	{#if label}
		<span class="toggle-label tcenter label">{label}</span>
	{/if}

	<label class="toggle">
		<input type="checkbox" bind:checked value={'on'} {name} {disabled} />
		<span class="slider"></span>
	</label>
</div>

<style>
	.toggle-container {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.toggle-label {
		font-size: 14px;
		color: #333;
	}

	.toggle {
		display: inline-block;
		position: relative;
		width: 50px;
		height: 26px;
	}

	.toggle input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: 0.4s;
		border-radius: 34px;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 18px;
		width: 18px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		transition: 0.4s;
		border-radius: 50%;
	}

	input:checked + .slider {
		background-color: #4caf50;
	}

	input:checked + .slider:before {
		transform: translateX(24px);
	}

	input:disabled + .slider {
		background-color: #aaa;
		cursor: not-allowed;
	}
</style>
