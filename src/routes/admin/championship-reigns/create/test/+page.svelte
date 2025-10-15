<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncForm from '$lib/components/forms/async-form.svelte';

	let steps = 3;
	let currentStep = 1;
	let form: HTMLFormElement;
	export let data;

	const tagTeamChampionships = data.championships
		.filter((championship) => championship.tag)
		.map((c) => c.id);
	let selectedChampionship: number | null = null;
	let isTag = false;

	const handleStep = (action: 'add' | 'subtract') => (event: Event) => {
		event.preventDefault();
		if (action === 'add' && currentStep < steps) {
			const stepInputs = form.querySelectorAll(
				`.step-${currentStep} input`
			) as NodeListOf<HTMLInputElement>;
			const invalidInput = Array.from(stepInputs).find((input) => !input.checkValidity());

			if (!invalidInput) currentStep += 1;
			if (invalidInput) invalidInput.reportValidity();
		} else if (action === 'subtract' && currentStep > 1) {
			currentStep -= 1;
		}
	};

	$: isTag = tagTeamChampionships.includes(selectedChampionship || -1);
</script>

<AsyncForm bind:form method="post" showButtons={false} reset={false}>
	<section class="step-form-container" style="--steps: {steps}; --currentStep: {currentStep}">
		<div class="form-steps">
			<div class="step step-1" class:active={currentStep === 1}>
				<header class="step-header">
					<h2 class="uppercase dreadnotus">Championship</h2>
					<small>Select the championship for the new reign.</small>
				</header>

				<div class="step-content">
					<ul>
						{#each data.championships as championship}
							<li class="item {championship.brand?.toLowerCase()}">
								<label class="radio-label form-item relative">
									<input
										type="radio"
										name="championship"
										class="app-radio"
										value={championship.id}
										bind:group={selectedChampionship}
										required
									/>
									<div class="custom-championship inner">
										<img
											width="80"
											height="80"
											src={championship.image}
											alt={championship.name}
											use:errorimage={'/unknown-championship.webp'}
										/>
										<span>{championship.name}</span>
									</div>
								</label>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="step step-2" class:active={currentStep === 2}>
				<header class="step-header">
					<h2 class="uppercase dreadnotus">Wrestler</h2>
					<small>Select the wrestler who will hold the championship.</small>
					{#if isTag}<small>Es de tag team</small>{/if}
				</header>

				<div class="step-content">
					<ul>
						{#each data.wrestlers as wrestler}
							<li class="item {wrestler.brand?.toLowerCase()}">
								<label class="radio-label form-item relative">
									<input
										type="radio"
										name="wrestler"
										class="app-radio"
										value={wrestler.id}
										required
									/>
									<div class="custom-wrestler inner">
										<img
											width="80"
											height="80"
											src={wrestler.image_name}
											alt={wrestler.name}
											use:errorimage={'/vacant.webp'}
										/>
										<span>{wrestler.name}</span>
									</div>
								</label>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="step step-3" class:active={currentStep === 3}>
				<header class="step-header">
					<h2 class="uppercase dreadnotus">Details</h2>
					<small>
						Provide the details for the new championship reign such as dates and way of winning.
					</small>
				</header>
			</div>

			<div class="step-form-buttons">
				<button type="button" class="btn button" on:click={handleStep('subtract')}>Atrás</button>
				<button type="button" class="btn button cta" on:click={handleStep('add')}>Siguiente</button>
			</div>
		</div>
	</section>
</AsyncForm>

<style>
</style>
