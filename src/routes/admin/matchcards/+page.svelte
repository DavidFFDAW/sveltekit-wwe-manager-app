<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';

	export let data;
</script>

<div class="matchcards-page">
	{#each data.matchcards as matchcard}
		<a class="matchcard box flex start gap-20" href="/admin/matchcards/upsert?slug={matchcard.id}">
			<img src={matchcard.ppv_image} alt={matchcard.ppv_name} width="80" />
			<h2>{matchcard.ppv_name}</h2>
		</a>
	{/each}

	<ButtonCreate endpoint="matchcards/upsert" />
</div>
