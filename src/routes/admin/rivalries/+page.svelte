<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import BrandsSelector from '$lib/components/forms/inputs/brands-selector.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import type { Rivalries } from '@prisma/client';

	let formElement: HTMLDivElement;
	const defaultRivalryData: Rivalries = {
		id: 0,
		first_rival: '',
		second_rival: '',
		intensity: '',
		brand: '',
		created_at: null,
		updated_at: null
	};
	let rivalryData: Rivalries = { ...defaultRivalryData };
	export let data;
	let currentTab: string = 'all';

	const handleRivalryEdition = (rivalry: Rivalries) => (event: Event) => {
		event.preventDefault();
		rivalryData = { ...rivalry };
		if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	const handleReset = () => {
		rivalryData = { ...defaultRivalryData };
	};

	$: isUpdate = rivalryData.id > 0;
	$: filteredRivalries = data.rivalries.filter((rivalry) => {
		if (currentTab === 'all') return true;
		return rivalry.brand === currentTab;
	});
</script>

<div class="rivalries-page-container">
	<header class="page-header">
		<h1>Rivalidades</h1>
		<small>Consulta aquí tus rivalidades actuales</small>
	</header>

	<datalist id="rivalries-teams-wrestlers">
		{#each data.teams as team}
			<option value={team}>{team}</option>
		{/each}
		{#each data.wrestlers as wrestler}
			<option value={wrestler}>{wrestler}</option>
		{/each}
	</datalist>

	<div class="w1 box down" bind:this={formElement}>
		<AsyncForm
			method="post"
			reset={true}
			showButtons={false}
			updateId={rivalryData.id}
			afterResponse={handleReset}
		>
			<input type="hidden" name="_action" value={isUpdate ? 'update' : 'create'} />

			<div class="w1 flex column gap-medium">
				<div class="form-datas grid two-column-grid gap-small responsive">
					<Input
						label="Primer participante"
						name="first_rival"
						list="rivalries-teams-wrestlers"
						bind:value={rivalryData.first_rival}
						required
					/>
					<Input
						label="Segundo participante"
						name="second_rival"
						list="rivalries-teams-wrestlers"
						bind:value={rivalryData.second_rival}
						required
					/>
					<RadioList
						label="Intensidad"
						name="intensity"
						bind:value={rivalryData.intensity}
						options={[
							{ label: 'Baja', value: 'low' },
							{ label: 'Media', value: 'medium' },
							{ label: 'Alta', value: 'high' },
							{ label: 'Muy alta', value: 'higher' }
						]}
					/>

					<BrandsSelector bind:value={rivalryData.brand} />
				</div>

				<div class="w1 flex {isUpdate ? 'between' : 'end'} acenter">
					{#if isUpdate}
						<button type="reset" class="btn secondary" on:click={handleReset}>
							{isUpdate ? 'Cancelar' : 'Limpiar'}
						</button>
					{/if}

					<button type="submit" class="btn cta rounded">
						{isUpdate ? 'Actualizar Rivalidad' : 'Crear Rivalidad'}
					</button>
				</div>
			</div>
		</AsyncForm>
	</div>

	<section class="rivalries-section down">
		<h2 class="uppercase">Rivalidades Actuales</h2>

		<div class="tabs">
			<header class="brand-tabs">
				<label class="brand-tab-item relative" class:active={currentTab === 'all'}>
					<input
						type="radio"
						class="app-radio"
						name="brand-tab"
						bind:group={currentTab}
						value="all"
					/>
					<span>Todos</span>
				</label>
				<label class="brand-tab-item relative" class:active={currentTab === 'raw'}>
					<input
						type="radio"
						class="app-radio"
						name="brand-tab"
						bind:group={currentTab}
						value="raw"
					/>
					<span>Raw</span>
				</label>
				<label class="brand-tab-item relative" class:active={currentTab === 'smackdown'}>
					<input
						type="radio"
						class="app-radio"
						name="brand-tab"
						bind:group={currentTab}
						value="smackdown"
					/>
					<span>SmackDown</span>
				</label>
				<label class="brand-tab-item relative" class:active={currentTab === 'awl'}>
					<input
						type="radio"
						class="app-radio"
						name="brand-tab"
						bind:group={currentTab}
						value="awl"
					/>
					<span>AWL</span>
				</label>
			</header>

			<div class="tab-content">
				{#if filteredRivalries.length === 0}
					<p>No hay rivalidades para esta marca.</p>
				{/if}
				<ul class="rivalries-list flex column gap-smaller">
					{#each filteredRivalries as rivalry}
						<li class="w1 box rivalry-item rivalry relative">
							<p class="rivalry-participants">
								<span class="rival">{rivalry.first_rival}</span> VS
								<span class="rival">{rivalry.second_rival}</span>
							</p>

							<p class="rivalry-intensity-item">
								<span class="intensity">{rivalry.intensity}</span>
							</p>

							{#if currentTab === 'all'}
								<p class="rivalry-brand-item {rivalry.brand}-brand">
									<span class="brand">{rivalry.brand}</span>
								</p>
							{/if}

							<div class="action-buttons-container">
								<button
									class="btn small warn"
									aria-label="Editar"
									on:click|preventDefault={handleRivalryEdition(rivalry)}
								>
									<i class="bi bi-pencil"></i>
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>
</div>

<style>
	.rivalry-item.rivalry {
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 12px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.rivalry-item.rivalry .rivalry-participants {
		color: #c0392b;
		font-weight: bold;
	}
	.rivalry-item.rivalry .rivalry-participants .rival {
		text-transform: capitalize;
		color: #000;
	}

	.brand-tabs {
		display: flex;
		align-items: center;
	}
	.brand-tabs .brand-tab-item {
		flex: 1;
		text-align: center;
		display: block;
		position: relative;
		padding: 6px 12px;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 0;
		border-right: 0;
		outline: 0;
		cursor: pointer;
	}
	.brand-tabs .brand-tab-item.active {
		background-color: #ada1a1;
		color: #000;
	}

	.brand-tabs .brand-tab-item:first-child {
		border-radius: 5px 0 0 0;
	}
	.brand-tabs .brand-tab-item:last-child {
		border-right: 1px solid #ccc;
		border-radius: 0 5px 0 0;
	}

	.tabs .tab-content {
		background: #fff;
		border: 1px solid #ccc;
		border-top: 0;
		padding: 15px;
	}
</style>
