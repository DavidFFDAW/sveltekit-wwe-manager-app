<script lang="ts">
	import PagedList from '../paged-list.svelte';
	let {
		list: championships,
		nextStep,
		previousStep,
		selectedChampionshipId = $bindable()
	} = $props();
</script>

<div class="step-championship">
	<header class="step-header">
		<h2 class="step-title">Elige un campeonato</h2>
	</header>

	<div class="step-inner">
		<PagedList list={championships} bind:selected={selectedChampionshipId} name="championship_id" />
	</div>
	<div class="buttons">
		<button type="button" class="btn secondary" onclick={previousStep}>Atras</button>
		<button type="button" class="btn cta" onclick={nextStep} disabled={!selectedChampionshipId}>
			Siguiente
		</button>
	</div>
</div>
