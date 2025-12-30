<script lang="ts">
	import PagedList from '../paged-list.svelte';
	let {
		list: championships,
		currentStep = $bindable(),
		selectedChampionshipId = $bindable()
	} = $props();
</script>

<div class="step" data-step-number="1" data-step="championship">
	<header class="step-header">
		<h2 class="step-title">Elige un campeonato</h2>
	</header>

	<div class="step-inner">
		<PagedList list={championships} bind:selected={selectedChampionshipId} name="championship_id" />
	</div>
	<div class="buttons">
		<button type="button" class="btn secondary" onclick={() => currentStep--}>Atras</button>
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
