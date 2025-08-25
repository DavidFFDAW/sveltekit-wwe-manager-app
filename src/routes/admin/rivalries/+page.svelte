<script lang="ts">
	import Debug from '$lib/components/visual/debug.svelte';
	export let data;
</script>

<div class="rivalries-page-container">
	<header class="page-header">
		<h1>Rivalidades</h1>
		<small>Consulta aquí tus rivalidades actuales</small>
	</header>

	<Debug datas={data} />

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
