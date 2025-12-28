<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Image from '$lib/components/visual/image.svelte';
	import { onMount } from 'svelte';
	import PagedList from './paged-list.svelte';

	const maxSteps = 3;
	let { data } = $props();
	let currentStep = $state(0);
	let selectedChampionshipId = $state(data.reign?.championship_id || null);
	let selectedChampionship = $derived(
		data.championships.find((c: any) => c.id === selectedChampionshipId)
	);

	let selectedWrestlerId = $state(data.reign?.wrestler_id || null);

	onMount(() => {
		setTimeout(() => {
			if (data.isUpdate) {
				currentStep = maxSteps - 1;
			}
		}, 1000);
	});
</script>

<div class="reigns-upsert-page" style="--total-steps: {maxSteps}; --current-step: {currentStep}">
	<AsyncForm
		action="upsert"
		method="post"
		redirect="/admin/championship-reigns"
		buttonText={data.isUpdate ? 'Actualizar Reinado' : 'Crear Reinado'}
		updateId={data.reign ? data.reign.id : ''}
		showButtons={false}
	>
		<div class="steps-container">
			<div class="step" data-step-number="1" data-step="championship">
				<header class="step-header">
					<h2 class="step-title">Elige un campeonato</h2>
				</header>

				<div class="step-inner">
					<PagedList
						list={data.championships}
						bind:selected={selectedChampionshipId}
						name="championship_id"
					/>
				</div>
				<div class="buttons">
					<button type="button" class="btn secondary">Atras</button>
					<button
						type="button"
						class="btn cta"
						onclick={() => currentStep++}
						disabled={!selectedChampionshipId}
					>
						Siguiente
					</button>
				</div>
			</div>
			<div class="step" data-step-number="2" data-step="wrestler">
				<header class="step-header">
					<h2 class="step-title">{selectedChampionship?.tag ? 'Equipo' : 'Luchador'}</h2>
				</header>

				<div class="step-inner">
					{#if selectedChampionship && selectedChampionship.tag}
						<p>Selecciona el equipo que va a tener el reinado.</p>
					{:else}
						<PagedList
							list={data.wrestlers}
							bind:selected={selectedWrestlerId}
							name="wrestler_id"
						/>
					{/if}
				</div>

				<div class="buttons">
					<button type="button" class="btn secondary" onclick={() => currentStep--}>Atras</button>
					<button type="button" class="btn cta" onclick={() => currentStep++}>Siguiente</button>
				</div>
			</div>

			<div class="step" data-step-number="3" data-step="reign-datas">
				<header class="step-header">
					<h2 class="step-title">Datos</h2>
				</header>

				<div class="step-inner">
					{#if selectedChampionship}
						<p>
							Estás creando un reinado para el campeonato: <strong
								>{selectedChampionship.name}</strong
							>
						</p>
						<!-- Aquí iría el formulario para los datos del reinado -->
					{:else}
						<p>Por favor, selecciona un campeonato en el primer paso.</p>
					{/if}
				</div>
				<div class="buttons">
					<button type="button" class="btn secondary" onclick={() => currentStep--}>Atras</button>
					<button type="submit" class="btn cta">
						{data.isUpdate ? 'Actualizar Reinado' : 'Crear Reinado'}
					</button>
				</div>
			</div>
		</div>
	</AsyncForm>
</div>

<style>
	:global(.app-main-entrypoint.page-admin-championship-reigns-upsert.admin-page) {
		padding: 0 20px;
	}
	.reigns-upsert-page {
		max-width: 600px;
		margin: 0 auto;
		overflow: hidden;
	}

	.steps-container {
		width: calc(100% * var(--total-steps));
		display: flex;
		transition: transform 0.3s ease-in-out;
		transform: translateX(calc(-100% / var(--total-steps) * var(--current-step)));
		min-height: 100dvh;
		max-height: 100dvh;
		padding: 20px 0;
	}

	.steps-container .step {
		position: relative;
		width: calc(100% / var(--total-steps));
		max-height: calc(100% - 40px);
		padding: 20px;
		background-color: #fff;
		box-sizing: border-box;
		border-radius: 12px;
		border: 1px solid #ddd;
	}
	.steps-container .step-header {
		position: relative;
		background-color: #fff;
		max-height: 40px;
	}
	.steps-container .step .step-inner {
		height: calc(100dvh - 80px - 40px - 40px - 20px);
		max-height: calc(100dvh - 80px - 40px - 40px - 20px);
		margin-top: 20px;
		padding: 5px;
		overflow-y: auto;
	}

	.steps-container .step-header h2 {
		width: 100%;
		position: relative;
		text-align: center;
		max-height: 40px;
	}
	.steps-container .step-header h2::after {
		content: '';
		position: absolute;
		top: calc(100% + 4px);
		left: 50%;
		transform: translateX(-50%);
		background-color: #000;
		border-radius: 50px;
		width: 25%;
		color: #fff;
		height: 4px;
		opacity: 0.12;
	}

	.steps-container .step ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.steps-container .step label input.app-radio + .inner {
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 8px;
		padding: 10px;
		border: 2px solid #ddd;
		border-radius: 8px;
	}
	.steps-container .step .buttons {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10px;
		border-top: 1px solid #bdbdbd;
		display: flex;
		justify-content: space-between;
	}
</style>
