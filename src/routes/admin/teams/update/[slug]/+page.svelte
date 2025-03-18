<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import UpsertTeam from '../../upsert-team.svelte';

	export let data;
</script>

<PageWrapper page="team-update-team-item">
	{#if data.team}
		<AsyncForm
			method="put"
			redirect="/admin/teams"
			buttonText="Guardar cambios"
			updateId={data.team.id}
		>
			<UpsertTeam team={data.team} />
		</AsyncForm>
	{/if}
</PageWrapper>
