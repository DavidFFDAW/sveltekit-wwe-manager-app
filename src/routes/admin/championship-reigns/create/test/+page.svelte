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

	const changeItem = (event: Event) => {
		setTimeout(() => {
			handleStep('add')(event);
		}, 250);
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
					<ul class="grid resource-list">
						{#each data.championships as championship}
							<li
								class="item {championship.brand?.toLowerCase()}"
								style="--color: var(--{championship.brand?.toLowerCase() || 'raw'})"
							>
								<label class="radio-label form-item relative">
									<input
										type="radio"
										name="championship"
										class="app-radio"
										value={championship.id}
										bind:group={selectedChampionship}
										on:change={changeItem}
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
					<ul class="grid resource-list">
						{#each data.wrestlers as wrestler}
							<li
								class="item {wrestler.brand?.toLowerCase()}"
								style="--color: var(--{wrestler.brand?.toLowerCase() || 'raw'})"
							>
								<label class="radio-label form-item relative">
									<input
										type="radio"
										name="wrestler"
										class="app-radio"
										value={wrestler.id}
										on:change={changeItem}
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
	ul.grid.resource-list {
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	ul.grid.resource-list li.item {
		margin: 0;
		width: 100%;
	}
	.custom-wrestler.inner {
		width: 100%;
		display: flex;
		flex-direction: row-reverse;
		align-items: flex-start;
		position: relative;
		background-color: #fff;
		border-radius: 0.5rem;
		border: 2px solid #ddd;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		padding-top: 5px;
		padding-bottom: 0;
		overflow: hidden;
		cursor: pointer;
	}
	.custom-wrestler.inner span {
		width: 100%;
		display: block;
		position: relative;
		text-align: left;
		white-space: pre-wrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-weight: 600;
		padding: 5px;
	}
	.custom-wrestler.inner span::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 5px;
		width: 30%;
		height: 3px;
		background-color: var(--color);
		opacity: 0.8;
		border-radius: 50px;
		z-index: 1;
	}
	.custom-wrestler.inner::after {
		content: '';
		position: absolute;
		width: 50%;
		height: 100%;
		transform: skewX(-10deg);
		top: 0;
		right: -10px;
		opacity: 0.4;
		background: linear-gradient(270deg, var(--color) 50%, transparent 100%);
		pointer-events: none;
		z-index: 0;
	}
	.custom-wrestler.inner img {
		position: relative;
		z-index: 2;
	}

	@media only screen and (max-width: 600px) {
		ul.grid.resource-list {
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		}
		/* .custom-wrestler.inner {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}
		.custom-wrestler.inner img {
			width: 80px;
			height: 80px;
			object-fit: cover;
			margin-bottom: 0.5rem;
		}
		.custom-wrestler.inner span {
			font-size: 0.9rem;
		} */
	}
</style>
