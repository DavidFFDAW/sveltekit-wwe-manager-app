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
</script>

<PageWrapper page="admin-championship-reigns-update-page">
	<AsyncForm method="post" buttonText="Guardar cambios" showButtons={false}>
		<div class="steps">
			<div class="step" class:active={step === 1}>
				<h2>Seleccionar campeonato</h2>
				<div class="wrestler-selector">
					<ResourceSelector
						name="championship_id"
						list={data.championships.map((championship) => ({
							id: championship.id,
							name: championship.name as string,
							image: championship.image as string
						}))}
						bind:selectedResource={selectedChampionship}
						afterSelection={(selected) => {
							if (selected) nextStep();
						}}
					/>
				</div>
			</div>
			<div class="step" class:active={step === 2}>
				<h2>Seleccionar luchador</h2>
				<div class="wrestler-selector">
					<WrestlersSelector
						name="wrestler_id"
						list={data.wrestlers}
						afterSelection={(selected) => {
							if (selected) nextStep();
						}}
						bind:selectedWrestler
					/>
				</div>
			</div>
			<div class="step" class:active={step === 3}>
				<div class="ppv-selector">
					<UpsertCommonDatas ppvs={data.ppvs} isUpdate={false} />
					<PpvSelector name="ppv-selector-picker" ppvs={data.ppvs} />
				</div>
			</div>
		</div>

		<div class="step-buttons">
			<button type="button" on:click={previousStep} disabled={step === 1}>
				<Icon icon="arrow-left" classes="icon-big" />
				<span class="btn-text">Anterior</span>
			</button>

			<button type={step < maxSteps ? 'button' : 'submit'} on:click={nextStep} transition:fade>
				{#if step < maxSteps}
					<Icon icon="arrow-right" classes="icon-big" />
				{:else}
					<Icon icon="check" classes="icon-big" />
				{/if}
				<span class="btn-text">{step < maxSteps ? 'Siguiente' : 'Guardar'}</span>
			</button>
		</div>
	</AsyncForm>
</PageWrapper>

<style>
	.wrestler-selector {
		width: 100%;
		overflow: hidden;
	}
	.steps {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		min-height: 70vh;
		max-height: 70vh;
		padding: 1rem;
		background-color: #f9f9f9;
		border-radius: 10px;
	}

	.step {
		display: none;
		flex: 1;
	}

	.step.active {
		display: block;
	}

	.step-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 2rem;
	}

	.step-buttons button {
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.ppv-selector {
		width: 100%;
		max-width: 300px;
		max-height: 400px;
		overflow: hidden;
		overflow-y: auto;
	}
</style>
