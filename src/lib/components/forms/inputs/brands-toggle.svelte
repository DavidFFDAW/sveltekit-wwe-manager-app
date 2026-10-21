<script lang="ts">
	import { brandsArray } from '$lib/constants/app';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'name' | 'type' | 'value' | 'disabled'> & {
		label?: string;
		name?: string;
		value?: string | undefined | null;
		disabled?: boolean;
	};

	let {
		label = 'Marca',
		name = 'brand',
		value = $bindable(brandsArray[0].name),
		disabled = false,
		...rest
	}: Props = $props();
</script>

<div class="form-item brands-toggle multi-state-toggle-switch">
	<span class="label-text">{label}</span>
	<input {...rest} type="hidden" {name} {value} />

	<div class="brand-toggle-buttons-container">
		{#each brandsArray as currentBrand}
			<button
				type="button"
				class:active={value === currentBrand.name}
				class="brand-toggle-button brand-{currentBrand.name}"
				aria-label={`Cambiar marca. Marca actual: ${currentBrand.title}`}
				onclick={() => (value = currentBrand.name)}
				title={`Cambiar a la marca ${currentBrand.title}`}
				{disabled}
			>
				<img src={currentBrand.image} alt={currentBrand.title} />
				<span class="brand-name">{currentBrand.title}</span>
			</button>
		{/each}
		<button
			type="button"
			class:active={value === 'other' || value === null || value === undefined}
			class="brand-toggle-button brand-other"
			aria-label="Cambiar marca. Marca actual: Otra"
			onclick={() => (value = 'other')}
			title="Cambiar a la marca Otra"
			{disabled}
		>
			<img src="/noimage.jpg" alt="Otra" />
			<span class="brand-name">Otra</span>
		</button>
	</div>
</div>

<style>
	.brands-toggle.multi-state-toggle-switch {
		width: 100%;
		max-width: 1000px;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
	}
	.brand-toggle-buttons-container {
		flex: 1;
		width: 100%;
		background: #f9f9f9;
		border: 1px solid #dedede;
		border-radius: 12px;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		max-width: 100%;
		overflow-y: auto;
		gap: 5px;
	}

	.brand-toggle-buttons-container .brand-toggle-button {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 5px 10px;
		border: 1px solid #dedede;
		border-radius: 999px;
		background: #fff;
		color: #1b1b1b;
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.03em;
		line-height: 1;
		text-transform: uppercase;
		cursor: pointer;
		box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
	}

	.brand-toggle-buttons-container .brand-toggle-button.active {
		background-color: #3d4045;
		border: 1px solid #000;
		color: #fff;
	}

	.brand-toggle-buttons-container .brand-toggle-button img {
		width: 35px;
		max-width: 35px;
		height: 35px;
		object-fit: contain;
		background-color: #eee;
		border: 1px solid #dedede;
		border-radius: 50%;
	}
	.brand-toggle-buttons-container .brand-toggle-button .brand-name {
		text-transform: uppercase;
		font-weight: 800;
		font-size: 16px;
		line-height: 1;
		letter-spacing: -0.3px;
		display: inline-block;
	}

	.brand-toggle-button:focus-visible {
		outline: 2px solid var(--toggle-color);
		outline-offset: 3px;
	}

	.brand-toggle-button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
</style>
