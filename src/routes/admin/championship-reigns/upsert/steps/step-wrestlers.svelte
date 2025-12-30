<script lang="ts">
	import PagedList from '../paged-list.svelte';
	let { list, currentStep = $bindable(), selectedWrestlerId = $bindable() } = $props();
</script>

<div class="step" data-step-number="2" data-step="wrestlers">
	<header class="step-header">
		<h2 class="step-title">Elige un luchador</h2>
	</header>

	<div class="step-inner">
		<PagedList type="wrestler" {list} bind:selected={selectedWrestlerId} name="wrestler_id" />
	</div>
	<div class="buttons">
		<button type="button" class="btn secondary" onclick={() => currentStep--}>Atras</button>
		<button
			type="button"
			class="btn cta"
			onclick={() => currentStep++}
			disabled={!selectedWrestlerId}
		>
			Siguiente
		</button>
	</div>
</div>
