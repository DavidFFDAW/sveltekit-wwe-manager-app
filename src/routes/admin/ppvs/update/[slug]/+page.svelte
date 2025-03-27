<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import UpsertPpv from '../../upsert-ppv.svelte';
	export let data;
</script>

<PageWrapper page="admin-ppv-update-page">
	{#if data.currentPPV}
		<AsyncForm
			action="updatePPV"
			method="post"
			classes="admin-form"
			buttonText="Actualizar PPV"
			redirect="/admin/ppvs"
			updateId={data.currentPPV.id}
		>
			<UpsertPpv ppvs={data.ppvs} ppv={data.currentPPV} />
		</AsyncForm>
	{/if}
</PageWrapper>
