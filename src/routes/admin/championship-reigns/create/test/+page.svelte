<script lang="ts">
	let steps = 3;
	let currentStep = 1;

	const handleStep = (action: 'add' | 'subtract') => (event: Event) => {
		event.preventDefault();
		if (action === 'add' && currentStep < steps) {
			currentStep += 1;
		} else if (action === 'subtract' && currentStep > 1) {
			currentStep -= 1;
		}
	};
</script>

<section class="form-steps-container" style="--steps: {steps}; --currentStep: {currentStep}">
	<div class="form-steps">
		<div class="step step-1" class:active={currentStep === 1}>
			<div class="circle">1</div>
			<div class="label">Select Championship</div>
		</div>
		<div class="step step-2" class:active={currentStep === 2}>
			<div class="circle">2</div>
			<div class="label">Select Wrestler</div>
		</div>
		<div class="step step-3" class:active={currentStep === 3}>
			<div class="circle">3</div>
			<div class="label">Common Data</div>
		</div>
	</div>

	<div class="buttons">
		<button type="button" on:click={handleStep('subtract')}>Previous</button>
		<button type="button" on:click={handleStep('add')}>Next</button>
	</div>
</section>

<style>
	.form-steps-container {
		width: 100%;
		height: calc(100dvh - 60px);
		overflow: hidden;
	}
	.buttons {
		position: fixed;
		bottom: 0;
		left: 0;
		width: calc(100% - var(--sidebar-width));
		padding: 10px;
		display: flex;
		justify-content: space-between;
		margin-left: var(--sidebar-width);
	}
	.form-steps {
		width: calc(100% * var(--steps));
		display: flex;
		height: 100%;
	}
	.form-steps .step {
		flex: 1;
		width: 100%;
		min-height: 100%;
		max-height: 100dvh;
		overflow-x: hidden;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 15px 10px;
		transition: transform 0.5s ease-in-out;
		transform: translateX(calc(-100% * (var(--currentStep) - 1)));
	}
</style>
