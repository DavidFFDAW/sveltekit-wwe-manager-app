<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ResourceSelector from '$lib/components/forms/selector/resource-selector.svelte';
	import WrestlersSelector from '$lib/components/forms/selector/specific/wrestlers-selector.svelte';
	import Icon from '$lib/components/icons/icon.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Image from '$lib/components/visual/image.svelte';
	import PpvSelector from '$lib/components/visual/ppv-selector.svelte';
	import type { Wrestler } from '@prisma/client';
	import { fade } from 'svelte/transition';
	import UpsertCommonDatas from '../../components/upsert-common-datas.svelte';

	let step = 1;
	const maxSteps = 3;
	export let data = {
		wrestlers: [],
		championships: [],
		ppvs: [],
		teams: []
	};
	const initialWrestlersList = data.wrestlers;
	const initialChampionshipsList = data.championships;

	const scrollIntoActiveStep = () => {
		const activeStep = document.querySelector('.step.active');
		if (activeStep) {
			activeStep.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	};
	const nextStep = () => {
		if (step < maxSteps) {
			step += 1;
		}
		scrollIntoActiveStep();
	};

	const previousStep = () => {
		if (step > 1) {
			step -= 1;
		}
		scrollIntoActiveStep();
	};

	let selectedChampionship: {
		id: number;
		name: string;
		image: string;
	} | null = null;
	let selectedWrestler: Wrestler | null = null;

	const searchItem =
		(type: 'wrestlers' | 'championships', initialList: any[]) => (event: Event) => {
			const input = event.target as HTMLInputElement;
			const query = input.value.toLowerCase();

			if (!query) {
				data[type] = initialList;
				return;
			}

			data[type] = data[type].filter((item) => item.name?.toLowerCase().includes(query)) as any[];
		};

	const selectItem = (type: 'wrestlers' | 'championships', item: any) => {
		if (type === 'wrestlers') {
			selectedWrestler = item;
		} else if (type === 'championships') {
			selectedChampionship = item;
		}
		nextStep();
	};
</script>

<PageWrapper page="admin-championship-reigns-update-page">
	<AsyncForm method="post" buttonText="Guardar cambios" showButtons={false}>
		<div class="form-wrapper" style="--currentStep: {step}; --maxSteps: {maxSteps}">
			<div class="w1 form-items form-steps">
				<section class="form-step step-1 form-custom-step" class:active={step === 1}>
					<h2 class="w1 form-step-title">
						<i class="bi bi-award icon-lg"></i>
						<span>Seleccionar campeonato</span>
					</h2>
					<div class="form-step-content fancy-scroll" transition:fade>
						<header class="w1 form-step-header">
							<input
								type="search"
								placeholder="Buscar luchador..."
								class="w1 searcher-input"
								on:input|preventDefault={searchItem('championships', initialChampionshipsList)}
							/>
						</header>

						<ul class="grid grid-two-column gap-smaller down">
							{#each data.championships as championship}
								<li class="championship-option-item">
									<label class="relative">
										<input
											type="radio"
											name="championship"
											class="app-radio"
											value={championship.id}
											bind:group={selectedChampionship}
											on:change={nextStep}
										/>
										<div class="inner championship-card">
											<Image
												src={championship.image}
												alt={championship.name as string}
												class="championship-image"
												width={50}
												height={50}
												placeholder="blur"
											/>
											<span class="championship-name">{championship.name}</span>
										</div>
									</label>
								</li>
							{/each}
						</ul>
					</div>
				</section>

				<section class="form-step step-2 form-custom-step" class:active={step === 2}>
					<h2 class="w1 form-step-title">
						<i class="bi bi-person icon-lg"></i>
						<span>Seleccionar luchador</span>
					</h2>
					<div class="form-step-content fancy-scroll" transition:fade>
						<header class="w1 form-step-header">
							<input
								type="search"
								placeholder="Buscar luchador..."
								class="w1 searcher-input"
								on:input={searchItem('wrestlers', initialWrestlersList)}
							/>
						</header>

						<ul class="grid grid-two-column gap-smaller down">
							{#each data.wrestlers as wrestler}
								<li class="championship-option-item">
									<label class="relative">
										<input
											type="radio"
											name="championship"
											class="app-radio"
											value={wrestler.id}
											bind:group={selectedWrestler}
											on:change={nextStep}
										/>
										<div class="inner championship-card">
											<Image
												src={wrestler.image_name as string}
												alt={wrestler.name as string}
												class="championship-image"
												width={50}
												height={50}
												placeholder="blur"
											/>
											<span class="championship-name">{wrestler.name}</span>
										</div>
									</label>
								</li>
							{/each}
						</ul>
					</div>
				</section>
			</div>
			<div class="w1 form-buttons flex between">
				<button
					type="button"
					class="btn secondary"
					aria-label="Anterior"
					on:click={previousStep}
					disabled={step === 1}
				>
					<i class="bi bi-arrow-left"></i>
				</button>

				<span>Paso {step} de {maxSteps}</span>

				<button
					type={step === maxSteps + 1 ? 'submit' : 'button'}
					class="btn cta"
					aria-label={step === maxSteps ? 'Finalizar' : 'Siguiente'}
					on:click={nextStep}
					disabled={step === maxSteps + 1}
				>
					<i class="bi bi-{step === maxSteps ? 'check' : 'arrow-right'}"></i>
				</button>
			</div>
		</div>
	</AsyncForm>
</PageWrapper>

<style>
	.form-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 15px;
		border-radius: 10px;
		border: 1px solid #ddd;
		min-height: calc(100dvh - 45px - 15px); /* Ajusta si es necesario */
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow: hidden; /* ¡Crucial para que los pasos fuera de vista no se salgan! */
	}

	.form-wrapper .form-items {
		display: flex;
		width: 100%;
		/* width: calc(100% * var(--maxSteps)); */
		height: 100%;
		min-height: 100%; /* Ajusta según sea necesario */
		/* Agregamos una transición para que el movimiento sea suave */
		transition: transform 0.5s ease-out;
		/* La transformación que mueve el contenedor completo */
		/* transform: translateX(calc(-100% * (var(--currentStep) - 1))); */
		gap: 15px;
	}

	.form-wrapper .form-items .form-step {
		display: none;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}
	.form-wrapper .form-items .form-step.active {
		display: block; /* Muestra solo el paso activo */
	}

	/* Estilos para el contenido dentro de cada paso */
	.form-wrapper .form-items .form-step .form-step-title {
		text-align: center;
		text-transform: uppercase;
		font-size: 1.5em;
		color: #333;
	}
	.form-wrapper .form-items .form-step .form-step-title i.bi {
		margin-right: 5px;
	}

	.form-step-content {
		width: 100%;
		padding: 0 12px;
		padding-top: 15px;
		flex-grow: 1;
		min-height: calc(100dvh - 195px); /* Ajusta según la altura del título */
		max-height: calc(100dvh - 195px); /* Ajusta según la altura del título y los botones */
		overflow: hidden auto;
	}

	.championship-card {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		padding: 10px 8px;
		border-radius: 8px;
		background-color: #fff;
		border: 1px solid #ccc;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
	}

	.championship-card .championship-name {
		margin-top: 5px;
		font-weight: bold;
		text-align: center;
		font-size: 0.9em;
		color: #333;
	}
</style>
