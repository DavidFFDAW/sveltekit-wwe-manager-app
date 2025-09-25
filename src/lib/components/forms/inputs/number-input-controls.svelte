<script lang="ts">
	export let name: string;
	export let label: string;
	export let value: number | undefined | null = null;
	let step: number = $$restProps.step ?? 1;

	const operate = (operation: 'add' | 'substract') => (ev: Event) => {
		ev.preventDefault();
		const currentValue = Number(value);
		if (value === null || isNaN(currentValue)) {
			value = 0;
			return;
		}

		if (operation === 'add') value = currentValue + step;
		if (operation === 'substract' && currentValue > 0) value = currentValue - step;
	};
</script>

<label class="form-item number-input-controls" class:required-label={$$restProps.required}>
	<span class="label form-label" class:required-label={$$restProps.required}>
		{label}
		{#if $$restProps.required}
			<span class="required-label">*</span>
		{/if}
	</span>

	<div class="input-number-container flex acenter gap-0">
		<button type="button" class="btn small" on:click={operate('substract')} aria-label="Restar uno">
			<i class="bi bi-dash"></i>
		</button>

		<input type="number" inputmode="numeric" {name} bind:value {...$$restProps} {step} />

		<button type="button" class="btn small" on:click={operate('add')} aria-label="Sumar uno">
			<i class="bi bi-plus"></i>
		</button>
	</div>
</label>

<style>
	.number-input-controls .input-number-container input,
	.number-input-controls .input-number-container .btn.small {
		height: 30px;
		background: #fff;
		border-radius: 0;
		border: 1px solid #ccc;
	}
	.number-input-controls .input-number-container .btn.small {
		width: 60px;
		padding: 0 0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.2rem;
		border-right: none;
	}
	.number-input-controls .input-number-container .btn.small:first-child {
		border-radius: 8px 0 0 8px;
	}
	.number-input-controls .input-number-container .btn.small:last-child {
		border-radius: 0 8px 8px 0;
		border-right: 1px solid #ccc;
		border-left: none;
	}
</style>
