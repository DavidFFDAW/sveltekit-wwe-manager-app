<script lang="ts">
	import PagedList from '../paged-list.svelte';
	let { list, selectedWrestlerId = $bindable(), nextStep, previousStep } = $props();
</script>

<div class="step-wrestlers">
	<header class="step-header">
		<h2 class="step-title">Elige un luchador</h2>
	</header>

	<div class="step-inner">
		<PagedList
			type="wrestler"
			{list}
			bind:selected={selectedWrestlerId}
			name="wrestler_id"
			{nextStep}
		/>
	</div>
	<div class="buttons">
		<button type="button" class="btn secondary" onclick={previousStep}>Atras</button>
		<button type="button" class="btn cta" onclick={nextStep} disabled={!selectedWrestlerId}>
			Siguiente
		</button>
	</div>
</div>
