<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import type { ChampionshipReign } from '@prisma/client';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let step = $state(data.upsert.isUpdate ? 3 : 0);
	let reign = $state(data.upsert.reign || ({} as ChampionshipReign));

	let selectedMitb = $derived(data.upsert.mitbs.find((mitb) => mitb.id === reign?.championship_id));
	let mitbGender = $derived(selectedMitb?.gender.toLowerCase() === 'm' ? 'male' : 'female');
	let wrestlerList = $derived(data.upsert.genderWrestlers[mitbGender as 'male' | 'female'] || []);
	let selectedWrestler = $derived(
		wrestlerList.find((wrestler) => wrestler.id === reign?.wrestler_id)
	);

	const incrementStep = () => {
		if (step < 3) step += 1;
	};

	const decrementStep = () => {
		if (step > 0) step -= 1;
	};

	$inspect({ step, upsert: data.upsert, selectedMitb, mitbGender, wrestlerList });
</script>

<section class="page">
	<AsyncForm
		method="post"
		showButtons={false}
		updateId={reign?.id}
		classes="w1 form-upsert-mitb-reign"
	>
		<div class="w1 ww-form-content-wrapper">
			<div class="w1 ww-form-steps-container">
				{#if step === 0}
					<div
						class="w1 ww-form-step ww-form-step-mitb"
						data-step={1}
						transition:fade={{ duration: 100 }}
					>
						<header class="ww-form-step-header">
							<h2>Money in the Bank</h2>
							<small>Selecciona el money in the bank</small>
						</header>

						<div class="mitb-container">
							{#each data.upsert.mitbs as mitb}
								<label class="relative">
									<input
										type="radio"
										name="championship_id"
										value={mitb.id}
										bind:group={reign.championship_id}
										onchange={incrementStep}
										class="app-radio"
									/>
									<div class="mitb-card" class:selected={reign.championship_id === mitb.id}>
										<h3>{mitb.name}</h3>
										<img width={60} src={mitb.image} alt={mitb.name} />
									</div>
								</label>
							{/each}
						</div>
					</div>
				{/if}

				{#if step === 1}
					<div
						class="w1 ww-form-step ww-form-step-wrestler"
						data-step={2}
						transition:fade={{ duration: 100 }}
					>
						<header class="ww-form-step-header">
							<h2>Ganador</h2>
							<small>Selecciona el luchador ganador del money in the bank</small>
						</header>

						<div class="wrestlers-list-container">
							{#each wrestlerList as wrestler}
								<label class="relative">
									<input
										type="radio"
										name="wrestler_id"
										value={wrestler.id}
										bind:group={reign.wrestler_id}
										onchange={incrementStep}
										class="app-radio"
									/>
									<div class="wrestler-card" class:selected={reign.wrestler_id === wrestler.id}>
										<h3>{wrestler.name}</h3>
										<img
											width={60}
											src={wrestler.image_name as string}
											alt={wrestler.name}
											use:errorimage
										/>
									</div>
								</label>
							{/each}
						</div>
					</div>
				{/if}

				{#if step === 2}
					<div
						class="w1 ww-form-step ww-form-step-resume"
						data-step={3}
						transition:fade={{ duration: 100 }}
					>
						<header class="ww-form-step-header">
							<h2>Resumen</h2>
							<small>Revisa los datos antes de guardar el money in the bank</small>
						</header>

						<div class="w1 flex column gap-10">
							<div class="flex column gap-5">
								<strong>Money in the Bank:</strong>
								<span>{selectedMitb?.name}</span>
								<span>{selectedMitb?.id}</span>
							</div>

							<div class="flex column gap-5">
								<strong>Ganador:</strong>
								<span>{selectedWrestler?.name}</span>
								<span>{selectedWrestler?.id}</span>
							</div>

							<pre>{JSON.stringify(reign, null, 2)}</pre>
						</div>
					</div>
				{/if}
			</div>

			<div class="ww-form-content-buttons ww-step-{step}">
				{#if step > 0}
					<button type="button" class="btn icon" onclick={decrementStep}>
						<i class="bi bi-arrow-left"></i>
						<span>Anterior</span>
					</button>
				{/if}

				<button
					type={step === 3 ? 'submit' : 'button'}
					class="btn cta icon"
					onclick={incrementStep}
				>
					<span>{step === 3 ? 'Guardar' : 'Siguiente'}</span>
					<i class="bi bi-arrow-right"></i>
				</button>
			</div>
		</div>
	</AsyncForm>
</section>

<style>
	.ww-form-content-wrapper {
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
		position: relative;
		height: calc(100dvh - 45px - 15px);
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		padding: 20px;
		/* overflow: hidden; */
	}
	.ww-form-content-wrapper .ww-form-steps-container {
		position: relative;
		min-height: calc(100% - 40px);
		max-height: calc(100% - 40px);
		padding-bottom: 5px;
		overflow: auto;
	}
	.ww-form-content-wrapper .ww-form-steps-container .ww-form-step {
		display: block;
		height: 100%;
	}
	.ww-form-content-wrapper .ww-form-content-buttons {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		bottom: 0px;
		padding: 8px 0 20px 0;
		gap: 8px;
	}
	.ww-form-content-wrapper .ww-form-content-buttons.ww-step-0 {
		justify-content: flex-end;
	}

	.ww-form-content-wrapper .ww-form-steps-container .ww-form-step header {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-bottom: 20px;
	}
	.ww-form-content-wrapper .ww-form-steps-container .ww-form-step header::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 50%;
		transform: translateX(-50%);
		width: 25%;
		height: 4px;
		background-color: var(--raw);
		border-radius: 2px;
	}

	.ww-form-content-wrapper .ww-form-steps-container .ww-form-step header h2,
	.ww-form-content-wrapper .ww-form-steps-container .ww-form-step header small {
		text-align: center;
	}
	.ww-form-content-wrapper .ww-form-steps-container .ww-form-step header h2 {
		font-size: 20px;
		font-weight: 700;
		text-transform: uppercase;
		color: #000;
	}
	.ww-form-content-wrapper .ww-form-steps-container .ww-form-step .mitb-container {
		display: grid;
		height: 100%;
		grid-template-rows: repeat(2, 1fr);
		gap: 12px;
	}
	.mitb-container label .mitb-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.mitb-container label .mitb-card.selected {
		border-color: #0070f3;
		background-color: #e6f0ff;
	}

	.ww-form-content-wrapper .ww-form-steps-container .ww-form-step .wrestlers-list-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		padding-right: 8px;
		gap: 12px;
	}

	.wrestlers-list-container label .wrestler-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 8px;
		transition: all 0.2s ease;
		cursor: pointer;
	}
	.wrestlers-list-container label .wrestler-card.selected {
		border-color: #0070f3;
		background-color: #e6f0ff;
	}
</style>
