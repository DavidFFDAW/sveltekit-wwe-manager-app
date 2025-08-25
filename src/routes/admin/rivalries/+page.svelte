<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import BrandsSelector from '$lib/components/forms/inputs/brands-selector.svelte';
	import type { Rivalries } from '@prisma/client';

	let rivalryData: Rivalries = {
		id: 0,
		first_rival: '',
		second_rival: '',
		intensity: 'high',
		brand: '',
		created_at: null,
		updated_at: null
	};
	export let data;
</script>

<div class="rivalries-page-container">
	<header class="page-header">
		<h1>Rivalidades</h1>
		<small>Consulta aquí tus rivalidades actuales</small>
	</header>

	<AsyncForm method="post" action="" showButtons={false} updateId={rivalryData.id}>
		<input type="hidden" name="_action" value={rivalryData.id ? 'update' : 'create'} />

		<div class="form-datas">
			<p>Primer participante</p>
			<p>Segundo participante</p>
			<p>Intensidad</p>
			<BrandsSelector bind:value={rivalryData.brand} />
		</div>

		<div class="w1 flex end">
			<button type="submit">Crear Rivalidad</button>
		</div>
	</AsyncForm>

	<ul class="rivalries-list">
		{#each data.rivalries as rivalry}
			<li class="rivalry-item rivalry">
				<p class="rivalry-participants">
					<span class="rival">{rivalry.first_rival}</span> VS
					<span class="rival">{rivalry.second_rival}</span>
				</p>
				<p class="rivalry-intensity-item">
					<span class="intensity">{rivalry.intensity}</span>
				</p>
			</li>
		{/each}
	</ul>
</div>
