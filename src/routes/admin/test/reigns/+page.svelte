<script lang="ts">
	import ListP from './list-p.svelte';

	let { data } = $props();
	let selectedChampionshipId: number | null = $state(data.reign.championshipId);
	let selectedChampionship = $derived(data.championships.find((c: any) => c.id === selectedChampionshipId));
</script>

<div class="reign-page">
	<div class="step">
		<div class="step-content">
			<div class="box">
				<ListP list={data.championships} bind:selectedId={selectedChampionshipId} />
			</div>

			<pre>{JSON.stringify(selectedChampionship, null, 10)}</pre>
		</div>

		<div class="w1 flex buttons between acenter gap-5">
			<button class="btn btn small info rounded"> Back </button>
			<button class="btn btn small cta rounded"> Next </button>
		</div>
	</div>
</div>

<style>
	.reign-page {
		max-width: 600px;
		margin: 0 auto;
	}
	.reign-page .step {
		max-height: 100dvh;
		overflow-y: auto;
	}

	.reign-page .step .buttons {
		max-height: 50px;
	}
	.reign-page .step .step-content {
		max-height: calc(100dvh - 50px - 15px);
	}
</style>
