<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import UpsertChampionship from '../../upsert-championship.svelte';
	export let data;
</script>

<PageWrapper page="admin-championship-update-page">
	{#if data.championship}
		<AsyncForm
			buttonText={'Actualizar campeonato'}
			updateId={data.championship.id}
			redirect="/admin/championships"
		>
			<UpsertChampionship championshipDatas={data.championship} />
		</AsyncForm>
	{/if}
</PageWrapper>
