<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Image from '$lib/components/visual/image.svelte';

	const maxSteps = 3;
	let { data } = $props();
	let currentStep = $state(0);
	let selectedChampionshipId = $state(data.reign?.championship_id || null);
	let selectedChampionship = $derived(
		data.championships.find((c: any) => c.id === selectedChampionshipId)
	);
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
				<div class="step-inner">
					<header class="step-header">
						<h2 class="step-title">Elige un campeonato</h2>
					</header>

					<ul class="championships-list flex column gap-medium astart">
						{#each data.championships as championship}
							<li class="w1 block">
								<label class="relative">
									<input
										type="radio"
										name="championship_id"
										class="app-radio"
										value={championship.id}
										bind:group={selectedChampionshipId}
										checked={selectedChampionshipId === championship.id}
									/>
									<div class="inner flex acenter gap-5">
										<Image
											src={championship.image}
											alt={championship.name as string}
											class="championship-image"
											width={25}
										/>
										<span class="championship-name">{championship.name}</span>
									</div>
								</label>
							</li>
						{/each}
					</ul>
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
				<div class="step-inner">
					<header class="step-header">
						<h2 class="step-title">2. Luchador</h2>
					</header>

					{#if selectedChampionship}
						<p>Seleccionaste el campeonato: <strong>{selectedChampionship.name}</strong></p>
						<!-- Aquí iría el formulario para seleccionar el luchador y las fechas -->
					{:else}
						<p>Por favor, selecciona un campeonato en el paso anterior.</p>
					{/if}
				</div>
				<div class="buttons">
					<button type="button" class="btn secondary" onclick={() => currentStep--}>Atras</button>
					<button type="button" class="btn cta" onclick={() => currentStep++}>Siguiente</button>
				</div>
			</div>

			<div class="step" data-step-number="3" data-step="reign-datas">
				<div class="step-inner">
					<header class="step-header">
						<h2 class="step-title">3. Datos del Reinado</h2>
					</header>

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
	.steps-container .step .step-inner {
		height: calc(100dvh - 80px - 40px);
		max-height: calc(100dvh - 80px - 40px);
		overflow-y: auto;
	}

	.steps-container .step-header h2 {
		width: 100%;
		position: relative;
		text-align: center;
		margin-bottom: 25px;
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
