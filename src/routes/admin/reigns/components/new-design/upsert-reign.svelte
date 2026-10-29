<script lang="ts">
	import ResourceSelector from '$lib/components/forms/selector/resource-selector.svelte';
	import type { UpserReignChampionship, UpsertReignView } from '../../interfaces/reigns.interfaces';
	import type { UpsertChampionshipReignDatas } from './interfaces';

	let step = $state<number>(1);
	let type = $state<UpsertReignView>('single');
	const { reignData }: { reignData: UpsertChampionshipReignDatas } = $props();
	let selectedChampionshipId = $state(reignData.reign.championship_id);
	let selectedChampionship: UpserReignChampionship | undefined = $state(
		reignData.reign.Championship as UpserReignChampionship
	);
	$effect(() => {
		selectedChampionship = reignData.championships.find(
			(championship) => championship.id === reignData.reign.championship_id
		);
		if (selectedChampionship) {
			type = selectedChampionship.tag ? (reignData.reign.team_id ? 'team' : 'no-team') : 'single';
		}
	});
</script>

<div class="container">
	{#if step === 1}
		<ResourceSelector
			list={reignData.championships}
			bind:selectedItem={selectedChampionshipId}
			name="championship_id"
			maxHeight={350}
		/>
	{/if}

	{#if step === 2}
		<ResourceSelector
			list={reignData.wrestlers}
			bind:selectedItem={reignData.reign.wrestler_id}
			name="championship_id"
			maxHeight={350}
		/>
	{/if}

	<div class="w1 buttons-container flex total start acenter gap-medium step-bigger-{step}">
		<button type="button" class="btn cta" onclick={() => (step -= 1)}> Anterior </button>
		<button type="button" class="btn cta" onclick={() => (step += 1)}> Siguiente </button>
	</div>

	<pre>
		{JSON.stringify(selectedChampionship, null, 4)}
	</pre>
</div>
