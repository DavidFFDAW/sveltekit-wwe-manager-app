<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import UpsertPpv from '../upsert-ppv.svelte';
	export let data;
</script>

<PageWrapper page="admin-ppv-create-page">
	<AsyncForm
		action="createPPV"
		method="post"
		classes="admin-form"
		buttonText="Crear PPV"
		redirect="/admin/ppvs"
	>
		<UpsertPpv ppvs={data.ppvs} />
	</AsyncForm>
</PageWrapper>
