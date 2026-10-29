<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import WrestlersSelector from '$lib/components/forms/selector/specific/wrestlers-selector.svelte';
	import type { ReignUpsertProps } from '../interfaces/reigns.interfaces';

	let step = $state(1);
	const props: ReignUpsertProps = $props();
	const maxSteps = 3;

	const nextStep = () => {
		if (step < maxSteps) {
			step++;
		}
	};

	const previousStep = () => {
		if (step > 1) {
			step--;
		}
	};
</script>

<div class="w1 multistep-form-container-external">
	<div class="w1 multistep-form" style="--maxStep: {maxSteps}; --currentStep: {step}">
		<div class="w1 multitep-form-step" data-step="1">
			<Box title="Selecciona el titulo" icon="info-circle">
				<p>Contenido del paso 1</p>
			</Box>
		</div>
		<div class="w1 multitep-form-step" data-step="2">
			<Box title="Selecciona el luchador" icon="info-circle">
				<WrestlersSelector
					list={props.wrestlers}
					name="wrestler"
					selectedItem={props.reign.wrestler_id}
				/>
			</Box>
		</div>
		<div class="w1 multitep-form-step" data-step="3">
			<Box title="Selección de paso 3" icon="info-circle">
				<p>Contenido del paso 3</p>
			</Box>
		</div>
	</div>

	<div class="w1 flex between gap-small multistep-form-buttons-container sidebar-msargin">
		<button type="button" class="btn secondary" onclick={previousStep} disabled={step === 0}>
			Anterior
		</button>
		{#if step >= maxSteps}
			<button type="submit" class="btn cta">Enviar</button>
		{:else}
			<button type="button" class="btn cta" onclick={nextStep} disabled={step === maxSteps}>
				Siguiente
			</button>
		{/if}
	</div>
</div>

<style>
	.multistep-form-container-external {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		overflow: hidden;
	}

	.multistep-form-container-external .multistep-form-buttons-container {
		width: 100%;
		padding: 5px 10px;
	}

	.multistep-form {
		width: 100%;
		display: flex;
		transition: transform 0.3s ease;
		transform: translateX(calc(-100% * (var(--currentStep) - 1)));
	}

	.multitep-form-step {
		flex-shrink: 0;
		width: 100%;
		padding: 10px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	}
</style>
